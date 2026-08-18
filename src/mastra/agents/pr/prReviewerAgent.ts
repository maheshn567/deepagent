import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const isGroq = !!process.env.GROQ_API_KEY;

const llmProvider = createOpenAI({
  baseURL: isGroq ? 'https://api.groq.com/openai/v1' : (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'),
  apiKey: process.env.GROQ_API_KEY || process.env.NVIDIA_API_KEY1 || process.env.NVIDIA_API_KEY || '',
});

const modelName = isGroq ? 'openai/gpt-oss-120b' : (process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct');

export const prReviewerAgent = new Agent({
  name: 'Master PR Reviewer Agent',
  instructions: `
    You are a Lead Staff Architect and Master PR Reviewer.

    ### Mission:
    Synthesize PR metadata, code diffs, quality audits, and performance evaluations into an executive GitHub Pull Request Review & PR Preview Report.

    ### Report Sections:
    1. **📌 PR Executive Summary & Preview**: High-level explanation of changes and feature intent.
    2. **🚦 Risk & Impact Rating**: Overall Rating (🟢 Low Risk | 🟡 Medium Risk | 🔴 High Risk).
    3. **🧹 Code Quality Audit**: Type safety, error handling, and refactoring suggestions.
    4. **⚡ Performance Audit**: Time/space complexity and resource optimizations.
    5. **📝 Actionable Line-by-Line Suggestions**: Exact diff annotations with code snippets.
    6. **⚖️ Final Verdict**: APPROVE / REQUEST CHANGES / COMMENT.
  `,
  model: llmProvider(modelName),
});

export default prReviewerAgent;
