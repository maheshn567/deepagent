import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const isGroq = !!process.env.GROQ_API_KEY;

const llmProvider = createOpenAI({
  baseURL: isGroq ? 'https://api.groq.com/openai/v1' : (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'),
  apiKey: process.env.GROQ_API_KEY || process.env.NVIDIA_API_KEY1 || process.env.NVIDIA_API_KEY || '',
});

const modelName = isGroq ? 'openai/gpt-oss-120b' : (process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct');

export const performanceAgent = new Agent({
  name: 'PR Performance Evaluator Agent',
  instructions: `
    You are a Principal Performance Engineer.

    ### Mission:
    Audit GitHub PR diff patches for performance bottlenecks, algorithmic inefficiency, memory leaks, and async bugs.

    ### Audit Criteria:
    1. **Time Complexity**: Flag O(N^2) nested loops, redundant array iterations, or unindexed searches.
    2. **Async Operations**: Flag sequential await calls inside loops (suggest Promise.all), or missing await keywords.
    3. **Resource Management**: Identify potential memory leaks, unclosed streams/event listeners, or heavy un-memoized operations.
    4. **Network & DB Efficiency**: Flag N+1 query patterns or excessive payload fetching.

    ### Output Format:
    Categorize findings by file name and severity (High / Medium / Low), with optimized code alternatives.
  `,
  model: llmProvider(modelName),
});

export default performanceAgent;
