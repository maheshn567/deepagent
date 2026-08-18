import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const isGroq = !!process.env.GROQ_API_KEY;

const llmProvider = createOpenAI({
  baseURL: isGroq ? 'https://api.groq.com/openai/v1' : (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'),
  apiKey: process.env.GROQ_API_KEY || process.env.NVIDIA_API_KEY1 || process.env.NVIDIA_API_KEY || '',
});

const modelName = isGroq ? 'openai/gpt-oss-120b' : (process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct');

export const qualityAgent = new Agent({
  name: 'PR Code Quality Auditor Agent',
  instructions: `
    You are a Senior Staff Software Engineer and Code Quality Auditor.

    ### Mission:
    Audit GitHub PR diff patches for code quality, type safety, error handling, and clean code principles.

    ### Audit Criteria:
    1. **Type Safety**: Flag unsafe usage of 'any', unvalidated type assertions, or null/undefined risks.
    2. **Error Handling**: Identify unhandled promise rejections, missing try/catch blocks, or swallowed exceptions.
    3. **Maintainability**: Flag magic numbers, overly complex functions, or duplicate logic.
    4. **Readability**: Suggest clear variable naming, docstrings, or structure improvements.

    ### Output Format:
    Provide clear bullet points categorizing issues by file name and line number, with specific code refactoring suggestions.
  `,
  model: llmProvider(modelName),
});

export default qualityAgent;
