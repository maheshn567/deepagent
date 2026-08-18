import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { finalConclusionAgent } from '../../agents/research/finalConclusionAgent.ts';

export const finalConclusionStep = createStep({
  id: 'final-conclusion-step',
  inputSchema: z.object({
    query: z.string(),
    rawResearch: z.string(),
    analyticsReport: z.string(),
  }),
  outputSchema: z.object({
    finalReport: z.string().describe('Professor-grade synthesized deep research report'),
  }),
  execute: async ({ inputData }) => {
    const { query, rawResearch, analyticsReport } = inputData;
    console.log(`\n🎓 [Professor Synthesis Step] Generating final deep research master report...`);

    const prompt = `Synthesize a comprehensive, professor-grade Deep Research Report for the query: "${query}".

    ### Complete Accumulated Web Research (Multi-Loop Findings):
    ${rawResearch}

    ### Strategic Analytics & Trend Evaluation:
    ${analyticsReport}
    `;

    const response = await finalConclusionAgent.generateLegacy(prompt, { maxSteps: 3 });

    return {
      finalReport: response.text,
    };
  },
});

export default finalConclusionStep;
