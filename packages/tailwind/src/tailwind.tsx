import * as React from "react";
import type { Config as TailwindOriginalConfig } from "tailwindcss";
import { useTailwindStyles } from "./hooks/use-tailwind-styles";
import { useStyleInlining } from "./hooks/use-style-inlining";
import { sanitizeClassName } from "./utils/compatibility/sanitize-class-name";
import { minifyCss } from "./utils/css/minify-css";
import { useSuspensedPromise } from "./hooks/use-suspensed-promise";

export type TailwindConfig = Pick<
  TailwindOriginalConfig,
  | "important"
  | "prefix"
  | "separator"
  | "safelist"
  | "blocklist"
  | "presets"
  | "future"
  | "experimental"
  | "darkMode"
  | "theme"
  | "corePlugins"
  | "plugins"
>;

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

interface EmailElementProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const isComponent = (
  element: React.ReactElement,
): element is React.ReactElement<unknown, React.FC<unknown>> => {
  return (
    typeof element.type === "function" ||
    // @ts-expect-error - we know this is a component that may have a render function
    element.type.render !== undefined
  );
};

export const Tailwind: React.FC<TailwindProps> = ({ children, config }) => {
  const { stylePerClassMap, nonInlinableClasses, sanitizedMediaQueries } =
    useTailwindStyles(children, config ?? {});

  const inline = useStyleInlining(stylePerClassMap);

  const nonInlineStylesToApply = sanitizedMediaQueries.filter(
    (style) => style.trim().length > 0,
  );

  const hasNonInlineStylesToApply = nonInlineStylesToApply.length > 0;
  let hasAppliedNonInlineStyles = false as boolean;

  function processElement(
    element: React.ReactElement<EmailElementProps>,
  ): React.ReactElement<EmailElementProps> {
    const propsToOverwrite = {} as Partial<EmailElementProps>;

    if (!hasAppliedNonInlineStyles && hasNonInlineStylesToApply) {
      if (element.type === "head") {
        hasAppliedNonInlineStyles = true;

        /*                   only minify here since it is the only place that is going to be in the DOM */
        const styleElement = (
          <style>{minifyCss(nonInlineStylesToApply.join(""))}</style>
        );

        return React.cloneElement(
          element,
          element.props,
          element.props.children,
          styleElement,
        );
      }
    }

    // If the element is a component, it's best to only process the children
    // after the component deals with them. The purpose of this is so that
    // advanced element manipulation can still work properly.
    if (element.props.children && !isComponent(element)) {
      const processedChillren = React.Children.map(
        element.props.children,
        (child) => {
          if (React.isValidElement<EmailElementProps>(child)) {
            return processElement(child);
          }

          return child;
        },
      );
      propsToOverwrite.children =
        processedChillren && processedChillren.length === 1
          ? processedChillren[0]
          : processedChillren;
    }

    if (element.props.className) {
      const { styles, residualClassName } = inline(element.props.className);
      propsToOverwrite.style = {
        ...styles,
        ...element.props.style,
      };
      if (!isComponent(element)) {
        if (residualClassName.trim().length > 0) {
          propsToOverwrite.className = residualClassName;
          /*
          We sanitize only the class names of Tailwind classes that we are not going to inline
          to avoid unpredictable behavior on the user's code. If we did sanitize all class names
          a user-defined class could end up also being sanitized which would lead to unexpected
          behavior and bugs that are hard to track.
        */
          for (const singleClass of nonInlinableClasses) {
            propsToOverwrite.className = propsToOverwrite.className.replace(
              singleClass,
              sanitizeClassName(singleClass),
            );
          }
        } else {
          propsToOverwrite.className = undefined;
        }
      }
    }

    const newProps = {
      ...element.props,
      ...propsToOverwrite,
    };
    const newChildren = propsToOverwrite.children
      ? propsToOverwrite.children
      : element.props.children;

    if (isComponent(element)) {
      const component =
        typeof element.type === "object"
          ? // @ts-expect-error - we know this is a component with a render function
            (element.type.render as React.FC)
          : (element.type as React.FC);
      const renderedComponent = component({
        ...element.props,
        ...propsToOverwrite,
      });

      if (React.isValidElement<EmailElementProps>(renderedComponent)) {
        return processElement(renderedComponent);
      }
    }

    return React.cloneElement(element, newProps, newChildren);
  }

  const childrenArray =
    React.Children.map(children, (child) => {
      if (React.isValidElement<EmailElementProps>(child)) {
        const element = child;

        return processElement(element);
      }

      return child;
    }) ?? [];

  if (hasNonInlineStylesToApply && !hasAppliedNonInlineStyles) {
    throw new Error(
      `You are trying to use the following Tailwind classes that have media queries: ${nonInlinableClasses.join(
        " ",
      )}.
For the media queries to work properly on rendering, they need to be added into a <style> tag inside of a <head> tag,
the Tailwind component tried finding a <head> element but just wasn't able to find it.

Make sure that you have either a <head> element at some point inside of the <Tailwind> component at any depth.

If you do already have a <head> element at some depth, please file a bug https://github.com/resend/react-email/issues/new?assignees=&labels=Type%3A+Bug&projects=&template=1.bug_report.yml.`,
    );
  }

  return <>{childrenArray}</>;
};
