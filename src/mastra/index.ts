import { Mastra } from '@mastra/core/mastra';
import { deepResearchAgent } from './agents/research/deepResearchAgent.ts';
import { researchAgent } from './agents/research/researchAgent.ts';
import { analyticsAgent } from './agents/research/analyticsAgent.ts';
import { finalConclusionAgent } from './agents/research/finalConclusionAgent.ts';
import { qualityAgent } from './agents/pr/qualityAgent.ts';
import { performanceAgent } from './agents/pr/performanceAgent.ts';
import { prReviewerAgent } from './agents/pr/prReviewerAgent.ts';

import { deepResearchWorkflow } from './workflows/research/workflow.ts';
import { prReviewWorkflow } from './workflows/pr/workflow.ts';

/**
 * Central Mastra application configuration.
 * All agents and workflows are registered here.
 */
export const mastra = new Mastra({
  agents: {
    deepResearchAgent,
    researchAgent,
    analyticsAgent,
    finalConclusionAgent,
    qualityAgent,
    performanceAgent,
    prReviewerAgent,
  },
  workflows: {
    deepResearchWorkflow,
    prReviewWorkflow,
  },
});
