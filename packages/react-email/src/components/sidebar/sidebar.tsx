'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { useEmails } from '../../contexts/emails';
import { cn } from '../../utils';
import { Logo } from '../logo';
import { IconEmail } from '../icons/icon-email';
import { IconLink } from '../icons/icon-link';
import { SidebarDirectoryChildren } from './sidebar-directory-children';

interface SidebarProps {
  className?: string;
  currentEmailOpenSlug?: string;
  style?: React.CSSProperties;
}

interface SidebarTabTriggerProps {
  className?: string;
  children?: React.ReactNode;

  tabValue: SidebarTab;
  activeTabValue: SidebarTab;
}

type SidebarTab = 'email-templates' | 'link-checker';

const SidebarTabTrigger = ({
  children,
  className,
  tabValue,
  activeTabValue,
}: SidebarTabTriggerProps) => {
  return (
    <Tabs.Trigger
      className={clsx(
        'w-[40px] h-[40px] flex items-center justify-center bg-transparent data-[active=true]:bg-slate-6 text-white',
        className,
      )}
      data-active={tabValue === activeTabValue}
      value={tabValue}
    >
      {children}
    </Tabs.Trigger>
  );
};

export const Sidebar = ({
  className,
  currentEmailOpenSlug,
  style,
}: SidebarProps) => {
  const [activeTabValue, setActiveTabValue] =
    React.useState<SidebarTab>('email-templates');
  const { emailsDirectoryMetadata } = useEmails();

  return (
    <Tabs.Root
      asChild
      onValueChange={(v) => {
        setActiveTabValue(v as SidebarTab);
      }}
      orientation="vertical"
      value={activeTabValue}
    >
      <aside
        className={cn('border-r flex flex-col border-slate-6', className)}
        style={{ ...style }}
      >
        <div className="flex border-t border-slate-6 h-[calc(100vh_-_70px)]">
          <Tabs.List className="flex flex-col w-[40px] h-full border-r border-slate-6">
            <SidebarTabTrigger
              activeTabValue={activeTabValue}
              tabValue="email-templates"
            >
              <IconEmail height="24" width="24" />
            </SidebarTabTrigger>
            <SidebarTabTrigger
              activeTabValue={activeTabValue}
              className="relative"
              tabValue="link-checker"
            >
              <IconLink height="24" width="24" />
            </SidebarTabTrigger>
          </Tabs.List>
          <div>
            <div className="p-4 h-[70px] flex-shrink items-center hidden lg:flex">
              <Logo />
            </div>
            {/*activeTabValue === 'link-checker' && emailValidationWarnings ? (
              <WarningsView warnings={emailValidationWarnings} />
            ) : null*/}
            {activeTabValue === 'email-templates' ? (
              <div className="flex flex-col w-[calc(100vw-36px)] h-full lg:w-full lg:min-w-[231px] lg:max-w-[231px]">
                <nav className="p-4 flex-grow lg:pt-0 pl-0 w-full flex flex-col overflow-y-auto">
                  <Collapsible.Root>
                    <React.Suspense>
                      <SidebarDirectoryChildren
                        currentEmailOpenSlug={currentEmailOpenSlug}
                        emailsDirectoryMetadata={emailsDirectoryMetadata}
                        isRoot
                        open
                      />
                    </React.Suspense>
                  </Collapsible.Root>
                </nav>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </Tabs.Root>
  );
};
