// import fs from 'fs';
// import shell from 'shelljs';
// import { setupServer } from '../utils/run-server';

interface BuildPreviewArgs {
  dir: string;
}

export const buildPreview = async (_: BuildPreviewArgs) => {
  // try {
  //   if (fs.existsSync(REACT_EMAIL_ROOT)) {
  //     await setupServer('build', dir, '');
  //     return;
  //   }
  //
  //   await downloadClient();
  //
  //   await setupServer('build', dir, '');
  // } catch (error) {
  //   console.log(error);
  //   shell.exit(1);
  // }
};

interface StartPreviewArgs {
  port: string;
}

export const startPreview = async (_: StartPreviewArgs) => {
  // try {
  //   if (fs.existsSync(REACT_EMAIL_ROOT)) {
  //     await setupServer('start', '', port);
  //     return;
  //   }
  //
  //   await downloadClient();
  //
  //   await setupServer('start', '', port);
  // } catch (error) {
  //   console.log(error);
  //   shell.exit(1);
  // }
};
