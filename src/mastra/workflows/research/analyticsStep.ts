import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { analyticsAgent } from '../../agents/research/analyticsAgent.ts';
import { researchAgent } from '../../agents/research/researchAgent.ts';

export const analyticsStep = createStep({
  id: 'analytics-step',
  inputSchema: z.object({
    query: z.string(),
    rawResearch: z.string(),
  }),
  outputSchema: z.object({
    query: z.string(),
    rawResearch: z.string(),
    analyticsReport: z.string(),
  }),
  execute: async ({ inputData }) => {
    let { query, rawResearch } = inputData;
    let isSatisfied = false;
    let iteration = 0;
    const maxIterations = 2; // Capped to 2 loops to stay safely under LiteLLM/Groq 10k TPM limit
    let finalAnalyticsReport = '';

    while (!isSatisfied && iteration < maxIterations) {
      iteration++;
      console.log(`\n🔍 [Analytics Evaluator - Loop ${iteration}/${maxIterations}] Assessing research depth...`);

      const response = await analyticsAgent.generateLegacy(
        `Evaluate accumulated research for query: "${query}".

        ### Research Findings:
        ${rawResearch.substring(0, 4000)}

        Provide JSON output indicating if key angles are satisfied or if 1 targeted missing query is needed.`,
        { maxSteps: 2 }
      );

      const responseText = response.text || '';

      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/(\{[\s\S]*"isSatisfied"[\s\S]*\})/);

      let parsedResult: { isSatisfied?: boolean; missingQueries?: string[]; analyticsReport?: string } = {};

      if (jsonMatch) {
        try {
          parsedResult = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.warn('⚠️ Standard response received without JSON block.');
        }
      }

      isSatisfied = parsedResult.isSatisfied ?? true;
      finalAnalyticsReport = parsedResult.analyticsReport || responseText;

      // If Analytics Agent requests more data and we have loop budget left:
      if (!isSatisfied && parsedResult.missingQueries && parsedResult.missingQueries.length > 0 && iteration < maxIterations) {
        const topMissingQuery = parsedResult.missingQueries[0]; // Take 1 focused query to conserve tokens
        console.log(`🌐 [Analytics Evaluator] Requesting refined search for: "${topMissingQuery}"`);

        const additionalQueryPrompt = `Search the web using 'web-search-mcp' for: ${topMissingQuery}`;
        const newResearchResponse = await researchAgent.generateLegacy(additionalQueryPrompt, { maxSteps: 2 });
        
        // Append clean, truncated insights (max 1000 chars)
        const cleanSnippet = newResearchResponse.text.substring(0, 1000);
        rawResearch += `\n\n### Refinement Findings (${topMissingQuery}):\n${cleanSnippet}`;
      } else {
        console.log(`✅ [Analytics Evaluator] Research context is sufficient! Proceeding to final synthesis.`);
        isSatisfied = true;
      }
    }

    return {
      query,
      rawResearch,
      analyticsReport: finalAnalyticsReport,
    };
  },
});

export default analyticsStep;
