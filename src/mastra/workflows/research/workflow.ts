import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import webResearchStep from './researchStep.ts';
import analyticsStep from './analyticsStep.ts';
import finalConclusionStep from './conclusionStep.ts';

export const deepResearchWorkflow = createWorkflow({
  id: 'deep-research-workflow',
  inputSchema: z.object({
    query: z.string().describe('The main topic or query to research'),
  }),
  outputSchema: z.object({
    finalReport: z.string().describe('Final professor-grade deep research report'),
  }),
})
  .then(webResearchStep)
  .then(analyticsStep)
  .then(finalConclusionStep)
  .commit();

export default deepResearchWorkflow;
