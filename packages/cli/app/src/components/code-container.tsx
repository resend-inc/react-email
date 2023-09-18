import { LayoutGroup, motion } from 'framer-motion';
import * as React from 'react';

import { PreviewLanguage, copyTextToClipboard, languageMap } from '../helpers';

import { Code } from './code';
import { IconButton, IconCheck, IconClipboard, IconDownload } from './icons';
import { Tooltip } from './tooltip';

interface MarkupProps {
  content: string;
  language: PreviewLanguage;
}

interface CodeContainerProps {
  activeLang: string;
  markups: MarkupProps[];
  setActiveLang: (lang: string) => void;
}

export const CodeContainer: React.FC<Readonly<CodeContainerProps>> = ({
  activeLang,
  markups,
  setActiveLang
}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const renderDownloadIcon = () => {
    const value = markups.filter((markup) => markup.language === activeLang);
    const file = new File([value[0].content], `email.${value[0].language}`);
    const url = URL.createObjectURL(file);

    return (
      <a
        href={url}
        download={file.name}
        className="transition ease-in-out duration-200 hover:text-dark-bg-text"
      >
        <IconDownload />
      </a>
    );
  };

  const renderClipboardIcon = () => {
    const handleClipboard = async () => {
      const activeContent = markups.filter(({ language }) => activeLang === language);
      setIsCopied(true);
      await copyTextToClipboard(activeContent[0].content);
      setTimeout(() => setIsCopied(false), 3000);
    };

    return (
      <IconButton onClick={handleClipboard}>
        {isCopied ? <IconCheck /> : <IconClipboard />}
      </IconButton>
    );
  };

  React.useEffect(() => {
    setIsCopied(false);
  }, [activeLang]);

  return (
    <pre
      className={
        'border-dark-bg-border relative w-full items-center whitespace-pre rounded-md border text-sm backdrop-blur-md'
      }
      style={{
        background:
          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
        boxShadow: 'rgb(0 0 0 / 10%) 0px 5px 30px -5px',
        lineHeight: '130%'
      }}
    >
      <div className="h-9 border-b border-dark-bg-border">
        <div className="flex">
          <LayoutGroup id="code">
            {markups.map(({ language }) => {
              const isCurrentLang = activeLang === language;
              return (
                <motion.button
                  className={`relative py-[8px] px-4 text-sm font-medium font-sans transition ease-in-out duration-200 hover:text-dark-bg-text ${
                    activeLang !== language ? 'text-slate-11' : 'text-dark-bg-text'
                  }`}
                  onClick={() => setActiveLang(language)}
                  key={language}
                >
                  {isCurrentLang && (
                    <motion.span
                      layoutId="code"
                      className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  {languageMap[language]}
                </motion.button>
              );
            })}
          </LayoutGroup>
        </div>
        <Tooltip>
          <Tooltip.Trigger asChild className="absolute top-2 right-2 hidden md:block">
            {renderClipboardIcon()}
          </Tooltip.Trigger>
          <Tooltip.Content>Copy to Clipboard</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger asChild className="text-gray-11 absolute top-2 right-8 hidden md:block">
            {renderDownloadIcon()}
          </Tooltip.Trigger>
          <Tooltip.Content>Download</Tooltip.Content>
        </Tooltip>
      </div>
      {markups.map(({ language, content }) => (
        <div className={`${activeLang !== language && 'hidden'}`} key={language}>
          <Code language={language}>{content}</Code>
        </div>
      ))}
    </pre>
  );
};
