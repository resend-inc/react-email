'use client';
import * as React from 'react';
import { Heading } from './heading';
import { IconHideSidebar } from './icons/icon-hide-sidebar';
import { Send } from './send';
import { Tooltip } from './tooltip';
import { ViewSizeControls } from './topbar/view-size-controls';
import { ActiveViewToggleGroup } from './topbar/active-view-toggle-group';

interface TopbarProps {
  currentEmailOpenSlug: string;
  pathSeparator: string;
  markup?: string;
  onToggleSidebar?: () => void;

  activeView?: string;
  setActiveView?: (view: string) => void;

  viewWidth?: number;
  setViewWidth?: (width: number) => void;
  viewHeight?: number;
  setViewHeight?: (height: number) => void;
}

export const Topbar: React.FC<Readonly<TopbarProps>> = ({
  currentEmailOpenSlug,
  pathSeparator,
  markup,
  activeView,
  setActiveView,
  viewWidth,
  setViewWidth,
  viewHeight,
  setViewHeight,
  onToggleSidebar,
}) => {
  return (
    <Tooltip.Provider>
      <header className="flex relative items-center px-4 justify-between h-[70px] border-b border-slate-6">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button
              className="hidden lg:flex rounded-lg px-2 py-2 transition ease-in-out duration-200 relative hover:bg-slate-5 text-slate-11 hover:text-slate-12"
              onClick={() => {
                if (onToggleSidebar) {
                  onToggleSidebar();
                }
              }}
              type="button"
            >
              <IconHideSidebar height={20} width={20} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Show/hide sidebar</Tooltip.Content>
        </Tooltip>

        <div className="items-center overflow-hidden hidden lg:flex text-center absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
          <Heading as="h2" className="truncate" size="2" weight="medium">
            {currentEmailOpenSlug.split(pathSeparator).pop()}
          </Heading>
        </div>

        <div className="flex gap-3 justify-between items-center lg:justify-start w-full lg:w-fit">
          {setViewWidth && setViewHeight && viewWidth && viewHeight ? (
            <ViewSizeControls
              setViewHeight={setViewHeight}
              setViewWidth={setViewWidth}
              viewHeight={viewHeight}
              viewWidth={viewWidth}
            />
          ) : null}

          {activeView && setActiveView ? (
            <ActiveViewToggleGroup
              activeView={activeView}
              setActiveView={setActiveView}
            />
          ) : null}

          {markup ? (
            <div className="flex justify-end">
              <Send markup={markup} />
            </div>
          ) : null}
        </div>
      </header>
    </Tooltip.Provider>
  );
};
