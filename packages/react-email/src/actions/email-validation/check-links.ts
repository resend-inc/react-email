'use server';

import { parse } from 'node-html-parser';
import { quickFetch } from './quick-fetch';

type Check = { passed: boolean } & (
  | {
    type: 'fetch_attempt';
    metadata: {
      fetchStatusCode: number | undefined;
    };
  }
  | {
    type: 'syntax';
  }
  | {
    type: 'security';
  }
);

export interface LinkCheckingResult {
  status: 'success' | 'warning' | 'error';
  link: string;
  checks: Check[];
}

const resultsCache = new Map<string, LinkCheckingResult[]>();

// eslint-disable-next-line @typescript-eslint/require-await
export const getLinkCheckingCache = async (cacheKey: string) => {
  return resultsCache.get(cacheKey);
};

export const checkLinks = async (
  code: string,
  cacheKey: string,
  invalidating = false,
) => {
  if (invalidating) resultsCache.delete(cacheKey);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (resultsCache.has(cacheKey)) return resultsCache.get(cacheKey)!;

  const ast = parse(code);

  const linkCheckingResults: LinkCheckingResult[] = [];

  const anchors = ast.querySelectorAll('a');
  for await (const anchor of anchors) {
    const link = anchor.attributes.href;
    if (!link) continue;
    if (link.startsWith('mailto:')) continue;

    const result: LinkCheckingResult = {
      link,
      status: 'success',
      checks: [],
    };

    try {
      const url = new URL(link);

      const res = await quickFetch(url);
      const succeeded =
        res.statusCode === undefined ||
        !res.statusCode.toString().startsWith('2');
      result.checks.push({
        type: 'fetch_attempt',
        passed: succeeded,
        metadata: {
          fetchStatusCode: res.statusCode,
        },
      });
      if (succeeded) {
        result.status = 'error';
      }

      if (link.startsWith('https://')) {
        result.checks.push({
          passed: true,
          type: 'security',
        });
      } else {
        result.checks.push({
          passed: false,
          type: 'security',
        });
        result.status = 'warning';
      }
    } catch (exception) {
      result.checks.push({
        passed: false,
        type: 'syntax',
      });
      result.status = 'error';
    }

    linkCheckingResults.push(result);
  }

  resultsCache.set(cacheKey, linkCheckingResults);

  return linkCheckingResults;
};
