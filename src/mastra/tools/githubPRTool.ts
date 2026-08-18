import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import 'dotenv/config';

/**
 * Mastra Tool to fetch PR files, git diff patches, and raw file contents directly from GitHub REST API.
 */
export const githubPRTool = createTool({
  id: 'github-pr-fetcher',
  description: 'Fetches modified files, line additions/deletions, and exact patch diffs for any GitHub Pull Request or repository commit.',
  inputSchema: z.object({
    owner: z.string().describe('GitHub repository owner / organization name (e.g. "facebook")'),
    repo: z.string().describe('GitHub repository name (e.g. "react")'),
    pullNumber: z.number().describe('The Pull Request number (e.g. 1)'),
  }),
  outputSchema: z.object({
    prTitle: z.string(),
    prDescription: z.string(),
    author: z.string(),
    baseBranch: z.string(),
    headBranch: z.string(),
    commitSha: z.string(),
    files: z.array(
      z.object({
        filename: z.string(),
        status: z.string(),
        additions: z.number(),
        deletions: z.number(),
        changes: z.number(),
        patch: z.string().optional(),
        rawUrl: z.string().optional(),
      })
    ),
  }),
  execute: async ({ owner, repo, pullNumber }) => {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error('Missing GITHUB_TOKEN in environment variables (.env)');
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'DeepAgent-PR-Reviewer',
    };

    try {
      // 1. Fetch Pull Request metadata
      const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, { headers });
      
      if (!prRes.ok) {
        throw new Error(`GitHub API PR fetch failed (${prRes.status}): ${prRes.statusText}`);
      }

      const prData = (await prRes.json()) as any;

      // 2. Fetch modified files and patch diffs (fallback to PR commit diff if files endpoint is restricted)
      let filesList: any[] = [];
      const filesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`, { headers });
      
      if (filesRes.ok) {
        const filesData = (await filesRes.json()) as any[];
        filesList = filesData.map((f) => ({
          filename: f.filename,
          status: f.status,
          additions: f.additions,
          deletions: f.deletions,
          changes: f.changes,
          patch: f.patch || '_No direct text patch preview (binary or large file)_',
          rawUrl: f.raw_url,
        }));
      } else {
        // Fallback: Fetch diff patch via media type header
        const diffRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
          headers: {
            ...headers,
            Accept: 'application/vnd.github.v3.diff',
          },
        });

        const patchText = diffRes.ok ? await diffRes.text() : '_Could not retrieve patch diff_';

        filesList = [
          {
            filename: `PR #${pullNumber} Summary`,
            status: 'modified',
            additions: prData.additions || 0,
            deletions: prData.deletions || 0,
            changes: prData.changed_files || 0,
            patch: patchText.substring(0, 3000),
            rawUrl: prData.html_url,
          },
        ];
      }

      return {
        prTitle: prData.title || 'Untitled PR',
        prDescription: prData.body || 'No description provided.',
        author: prData.user?.login || 'unknown',
        baseBranch: prData.base?.ref || 'main',
        headBranch: prData.head?.ref || 'feature',
        commitSha: prData.head?.sha || '',
        files: filesList,
      };
    } catch (error: any) {
      console.error('❌ Error executing GitHub PR Tool:', error.message);
      throw error;
    }
  },
});

export default githubPRTool;
