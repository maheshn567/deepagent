import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { researchAgent } from '../../agents/research/researchAgent.ts';

export const webResearchStep = createStep({
  id: 'web-research-step',
  inputSchema: z.object({
    query: z.string().describe('The primary research query'),
  }),
  outputSchema: z.object({
    query: z.string(),
    rawResearch: z.string().describe('Factual findings and metrics retrieved by the research agent'),
  }),
  execute: async ({ inputData }) => {
    const { query } = inputData;
    console.log(`\n🌐 [Research Agent Step 1] Initiating primary web search for: "${query}"`);
    
    const response = await researchAgent.generateLegacy(
      `Research the following query thoroughly using 'web-search-mcp'. Gather facts, metrics, and key data points: "${query}"`,
      { maxSteps: 3 }
    );

    return {
      query,
      rawResearch: response.text,
    };
  },
});

export default webResearchStep;
