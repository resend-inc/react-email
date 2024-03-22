import path from 'node:path';
import { promises as fs } from 'node:fs';
import { getImportedModules } from './get-imported-modules';

interface Module {
  path: string;

  dependencyPaths: string[];
  dependentPaths: string[];

  moduleDependencies: string[];
}

export type DependencyGraph = Record</* path to module */ string, Module>;

const readAllFilesInsideDirectory = async (directory: string) => {
  let allFilePaths: string[] = [];

  const topLevelDirents = await fs.readdir(directory, { withFileTypes: true });

  for await (const dirent of topLevelDirents) {
    const pathToDirent = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      allFilePaths = allFilePaths.concat(
        await readAllFilesInsideDirectory(pathToDirent),
      );
    } else {
      allFilePaths.push(pathToDirent);
    }
  }

  return allFilePaths;
};

const isJavascriptModule = (filePath: string) => {
  const extensionName = path.extname(filePath);

  return ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs'].includes(extensionName);
};

/**
 * Creates a stateful dependency graph that is structured in a way that you can get
 * the dependents of a module from its path.
 *
 * Stateful in the sense that it provides a `getter` and an "`updater`". The updater
 * will receive changes to the files, that can be perceived through some file watching mechanism,
 * so that it doesn't need to recompute the entire dependency graph but only the parts changed.
 */
export const createDependencyGraph = async (directory: string) => {
  const filePaths = await readAllFilesInsideDirectory(directory);
  const modulePaths = filePaths.filter(isJavascriptModule);
  const graph: DependencyGraph = Object.fromEntries(
    modulePaths.map((path) => [
      path,
      {
        path,
        dependencyPaths: [],
        dependentPaths: [],
        moduleDependencies: [],
      },
    ]),
  );

  const addModuleToGraph = async (filePath: string) => {
    if (!graph[filePath]) {
      graph[filePath] = {
        path: filePath,
        dependencyPaths: [],
        dependentPaths: [],
        moduleDependencies: [],
      }
    }
    const contents = await fs.readFile(filePath, 'utf8');

    const importedPaths = getImportedModules(contents);
    const importedPathsRelativeToDirectory = importedPaths.map(
      (dependencyPath) => {
        const isModulePath = !dependencyPath.startsWith('.');
        /*
          path.isAbsolute will return false if the path looks like JavaScript module imports
          e.g. path.isAbsolute('react-dom/server') will return false, but for our purposes this
          path is not a relative one.
        */
        if (!isModulePath && !path.isAbsolute(dependencyPath)) {
          let pathToDependencyFromDirectory = path.resolve(
            /*
              path.resolve resolves paths differently from what imports on javascript do.

              So if we wouldn't do this, for an email at "/path/to/email.tsx" with a dependecy path of "./other-email" 
              would end up going into /path/to/email.tsx/other-email instead of /path/to/other-email which is the
              one the import is meant to go to
            */
            path.dirname(filePath),
            dependencyPath,
          );

          /*
            If the path to the dependency does not include a file extension, such that our check
            for it being a javascript module fails, then we can assume it has the same as the `filePath`
          */
          if (!isJavascriptModule(pathToDependencyFromDirectory)) {
            pathToDependencyFromDirectory = `${pathToDependencyFromDirectory}${path.extname(filePath)}`;
          }

          return pathToDependencyFromDirectory;
        } else {
          // when either the path is a module or is absolute
          return dependencyPath;
        }
      },
    );

    graph[filePath]!.moduleDependencies =
      importedPathsRelativeToDirectory.filter(
        (dependencyPath) =>
          !dependencyPath.startsWith('.') && !path.isAbsolute(dependencyPath),
      );

    const nonNodeModuleImportPathsRelativeToDirectory = importedPathsRelativeToDirectory.filter(
      (dependencyPath) =>
        dependencyPath.startsWith('.') || path.isAbsolute(dependencyPath),
    )
    for (const importPath of nonNodeModuleImportPathsRelativeToDirectory) {
      graph[filePath]!.dependencyPaths.push(importPath);
      if (graph[importPath]) {
        graph[importPath]!.dependentPaths.push(filePath);
      } else {
        /*
          This import path might have not been initialized as it can be outside
          of the original directory.
        */
        graph[importPath] = {
          path: importPath,
          moduleDependencies: [],
          dependencyPaths: [],
          dependentPaths: [filePath],
        };
      }
    }
  };

  for (const filePath of modulePaths) {
    await addModuleToGraph(filePath);
  }

  const removeModuleFromGraph = (filePath: string) => {
    const module = graph[filePath];
    if (module) {
      for (const dependentPath of module.dependentPaths) {
        const dependentModule = graph[dependentPath];
        if (dependentModule) {
          dependentModule.dependencyPaths =
            dependentModule.dependencyPaths.filter(
              (dependencyPath) => dependencyPath !== filePath,
            );
        }
      }
      for (const dependencyPath of module.dependencyPaths) {
        const dependencyModule = graph[dependencyPath];
        if (dependencyModule) {
          dependencyModule.dependentPaths =
            dependencyModule.dependentPaths.filter(
              (dependentPath) => dependentPath !== filePath,
            );
        }
      }
      delete graph[filePath];
    }
  };

  return [
    graph,
    /**
      * @param pathToModified - A path relative to the previosuly provided {@link directory}.
      */
    async (
      event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
      pathToModified: string,
    ) => {
      switch (event) {
        case 'change':
          if (isJavascriptModule(pathToModified)) {
            if (graph[pathToModified] !== undefined) {
              removeModuleFromGraph(pathToModified);
            }

            await addModuleToGraph(pathToModified);
          }
          break;
        case 'add':
          if (isJavascriptModule(pathToModified)) {
            await addModuleToGraph(pathToModified);
          }
          break;
        case 'addDir':
          const filesInsideAddedDirectory =
            await readAllFilesInsideDirectory(pathToModified);
          const modulesInsideAddedDirectory =
            filesInsideAddedDirectory.filter(isJavascriptModule);
          for await (const filePath of modulesInsideAddedDirectory) {
            await addModuleToGraph(filePath);
          }
          break;
        case 'unlink':
          if (isJavascriptModule(pathToModified)) {
            removeModuleFromGraph(pathToModified);
          }
          break;
        case 'unlinkDir':
          const filesInsideDeletedDirectory =
            await readAllFilesInsideDirectory(pathToModified);
          const modulesInsideDeletedDirectory =
            filesInsideDeletedDirectory.filter(isJavascriptModule);
          for await (const filePath of modulesInsideDeletedDirectory) {
            removeModuleFromGraph(filePath);
          }
          break;
      }
    },
  ] as const;
};
