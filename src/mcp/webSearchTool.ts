import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Real-time Web Search Tool powered by Parallel AI Remote MCP Server (https://search.parallel.ai/mcp)
 * Optimized for token efficiency (truncates long excerpts to fit Groq 12,000 TPM limits).
 */
export const webSearchTool = createTool({
  id: 'web-search-mcp',
  description: 'Performs live, real-time web research using Parallel AI Remote MCP Server. Returns live web search results, excerpts, and news articles.',
  inputSchema: z.object({
    queries: z.array(z.string()).describe('List of search queries (e.g. ["future of software engineering AI 2026"])'),
    objective: z.string().describe('Description of the specific information, statistics, or facts you are looking for'),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        publishDate: z.string().optional(),
        excerpts: z.array(z.string()),
      })
    ),
  }),
  execute: async ({ queries, objective }) => {
    try {
      const response = await fetch('https://search.parallel.ai/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'web_search',
            arguments: {
              search_queries: queries,
              objective: objective || queries.join(' '),
            },
          },
        }),
      });

      const data = (await response.json()) as any;

      if (data.error || data.result?.isError) {
        const errorText = data.error?.message || data.result?.content?.[0]?.text || 'MCP Search request failed';
        console.error('Parallel MCP Search error:', errorText);
        return {
          results: [
            {
              title: 'Parallel MCP Notice',
              url: 'https://parallel.ai',
              excerpts: [errorText],
            },
          ],
        };
      }

      // Parse JSON payload inside MCP text content
      const textContent = data.result?.content?.[0]?.text;
      let rawResults: any[] = [];

      if (textContent) {
        try {
          const parsed = JSON.parse(textContent);
          rawResults = parsed.results || [];
        } catch {
          rawResults = [];
        }
      }

      // Return top 4 search results with clean truncated excerpts (max 800 chars) to stay within TPM limits
      const topResults = rawResults.slice(0, 4).map((r: any) => ({
        title: r.title || 'Untitled',
        url: r.url || '',
        publishDate: r.publish_date || '',
        excerpts: (r.excerpts || []).map((ex: string) => (ex.length > 800 ? ex.substring(0, 800) + '...' : ex)),
      }));

      return {
        results: topResults,
      };
    } catch (error: any) {
      console.error('Failed to query Parallel MCP server:', error.message);
      return {
        results: [
          {
            title: 'Search Execution Error',
            url: '',
            excerpts: [`Failed to query live search MCP: ${error.message}`],
          },
        ],
      };
    }
  },
});

export default webSearchTool;