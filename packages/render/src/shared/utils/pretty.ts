import type { Options } from 'prettier';
import html from 'prettier/plugins/html';
import { format } from 'prettier/standalone';

const defaults: Options = {
  endOfLine: 'lf',
  tabWidth: 2,
  plugins: [html],
  parser: 'html',
};

export const pretty = async (str: string, options: Options = {}) => {
  return format(str.replaceAll("\0", ""), {
    ...defaults,
    ...options,
  });
};
