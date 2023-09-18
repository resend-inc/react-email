import * as ToggleGroup from '@radix-ui/react-toggle-group';
import classnames from 'classnames';
import { LayoutGroup, motion } from 'framer-motion';
import * as React from 'react';
import { Heading } from './heading';

type TopbarElement = React.ElementRef<'header'>;
type RootProps = React.ComponentPropsWithoutRef<'header'>;

interface TopbarProps extends RootProps {
  activeView?: string;
  markup?: string;
  setActiveView?: (view: string) => void;
  title: string;
}

export const Topbar = React.forwardRef<TopbarElement, Readonly<TopbarProps>>(
  ({ className, title, markup, activeView, setActiveView, ...props }, forwardedRef) => {
    const columnWidth = 'w-[200px]';

    return (
      <header
        ref={forwardedRef}
        className={classnames(
          'bg-dark-bg flex relative items-center px-6 justify-between h-[70px] border-b border-dark-bg-border',
          className
        )}
        {...props}
      >
        <div className={`items-center overflow-hidden hidden lg:flex ${columnWidth}`}>
          <Heading as="h2" size="2" weight="medium" className="truncate">
            {title}
          </Heading>
        </div>

        <div className={`${columnWidth}`}>
          <LayoutGroup id="topbar">
            {setActiveView && (
              <ToggleGroup.Root
                className="inline-block items-center bg-darker-bg border border-dark-bg-border rounded-md overflow-hidden"
                type="single"
                value={activeView}
                aria-label="View mode"
                onValueChange={(value) => {
                  if (!value) return;
                  setActiveView(value);
                }}
              >
                <ToggleGroup.Item value="desktop">
                  <motion.div
                    className={classnames(
                      'text-sm font-medium px-1 py-1 sm:px-3 sm:py-2 transition ease-in-out duration-200 relative hover:text-dark-bg-text',
                      {
                        'text-dark-bg-text': activeView === 'desktop'
                      }
                    )}
                  >
                    {activeView === 'desktop' && (
                      <motion.span
                        layoutId="topbar"
                        className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    Desktop
                  </motion.div>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="source">
                  <motion.div
                    className={classnames(
                      'text-sm font-medium px-3 py-2 transition ease-in-out duration-200 relative hover:text-dark-bg-text',
                      {
                        'text-dark-bg-text': activeView === 'source'
                      }
                    )}
                  >
                    {activeView === 'source' && (
                      <motion.span
                        layoutId="nav"
                        className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    Source
                  </motion.div>
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            )}
          </LayoutGroup>
        </div>
      </header>
    );
  }
);

Topbar.displayName = 'Topbar';
