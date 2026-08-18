import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import 'dotenv/config';

/**
 * Mastra Tool to submit an official Pull Request Review comment to GitHub.
 * Includes automatic retry handling for transient GitHub 503/502 server errors.
 */
export const postPRReviewTool = createTool({
  id: 'post-pr-review',
  description: 'Submits an official GitHub PR review report with status (COMMENT, REQUEST_CHANGES, or APPROVE) directly to a Pull Request on GitHub.',
  inputSchema: z.object({
    owner: z.string().describe('GitHub repository owner / organization name'),
    repo: z.string().describe('GitHub repository name'),
    pullNumber: z.number().describe('The Pull Request number'),
    reviewReport: z.string().describe('The synthesized Markdown PR Review report'),
    event: z.enum(['COMMENT', 'REQUEST_CHANGES', 'APPROVE']).optional().default('COMMENT').describe('GitHub PR Review verdict event'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    reviewId: z.number().optional(),
    htmlUrl: z.string().optional(),
    message: z.string(),
  }),
  execute: async ({ owner, repo, pullNumber, reviewReport, event }) => {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error('Missing GITHUB_TOKEN in environment variables (.env)');
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'DeepAgent-PR-Reviewer',
    };

    const maxRetries = 3;
    let attempt = 0;
    let response: Response | null = null;
    let lastErrorMsg = '';

    while (attempt < maxRetries) {
      attempt++;
      try {
        console.log(`\n📤 [Post PR Review Tool] Submitting review on ${owner}/${repo}#${pullNumber} (Attempt ${attempt}/${maxRetries})...`);

        response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            body: reviewReport,
            event: event || 'COMMENT',
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          console.log(`✅ [Post PR Review Tool] Review successfully posted to GitHub! Review URL: ${data.html_url || 'Posted'}`);
          return {
            success: true,
            reviewId: data.id,
            htmlUrl: data.html_url,
            message: `Successfully posted GitHub PR Review on ${owner}/${repo}#${pullNumber}`,
          };
        }

        const errorText = await response.text();
        lastErrorMsg = `HTTP ${response.status}: ${errorText}`;

        // If GitHub returns transient 503/502/504, wait 3 seconds and retry
        if (response.status >= 500 && attempt < maxRetries) {
          console.warn(`⚠️ GitHub API returned ${response.status} server error. Waiting 3 seconds before retry...`);
          await new Promise((r) => setTimeout(r, 3000));
        } else {
          break;
        }
      } catch (err: any) {
        lastErrorMsg = err.message;
        if (attempt < maxRetries) {
          console.warn(`⚠️ Network request failed. Retrying in 3s...`);
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
    }

    console.error('❌ Error submitting GitHub PR Review:', lastErrorMsg);
    return {
      success: false,
      message: `Failed to post GitHub PR Review: ${lastErrorMsg}`,
    };
  },
});

export default postPRReviewTool;
