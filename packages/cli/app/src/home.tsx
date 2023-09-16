'use client';

import React from 'react';
import { Button, Heading, Text } from './components';
import { Shell } from './components/shell';

export const Home = ({ templateNames }: { templateNames: string[] }) => {
  React.useEffect(() => {
    document.title = 'JSX Email 📧';
  }, []);

  return (
    <Shell templateNames={templateNames}>
      <div className="max-w-md border border-slate-6 m-auto mt-56 rounded-md p-8">
        <Heading as="h2" weight="medium">
          Welcome to the React Email preview!
        </Heading>
        <Text as="p" className="mt-2 mb-4">
          To start developing your next email template, you can create a <code>.jsx</code> or{' '}
          <code>.tsx</code> file under the "emails" folder.
        </Text>

        <Button asChild>
          <a href="https://react.email/docs">Check the docs</a>
        </Button>
      </div>
    </Shell>
  );
};
