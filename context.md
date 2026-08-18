# Project Context & Architecture: Deep Research Agent with Mastra

This document provides a comprehensive overview of the **Deep Research Agent Architecture**, tools, LLM providers, and Mastra workflow pipeline implemented in this project.

---

## 🎯 Overview

The **Deep Research Agent** is a multi-step AI research system built with TypeScript and the **Mastra framework**. Instead of relying on a single prompt turn, the system uses a **3-phase specialized agent pipeline** to gather live web data, analyze strategic implications, and synthesize professor-grade research reports.

---

## 🏗️ System Architecture

```
User Query
   │
   ▼
Step 1: Research Agent ─────► Parallel AI Remote MCP Server (Live Web Search)
   │                           Country Info Tool & Calculator Tool
   ▼
Step 2: Analytics Agent ────► Strategic Driver & Trend Analysis
   │
   ▼
Step 3: Conclusion Agent ───► Professor-Grade Markdown Synthesis
```

---

## 🤖 Specialized Agents (`src/mastra/agents/`)

1. **`researchAgent.ts`**:
   - **Role:** Data & Fact Collector.
   - **Tools:** `webSearchTool` (Parallel MCP), `countryInfoTool`, `calculatorTool`.
   - **Responsibility:** Executes live web searches, extracts demographics, and performs exact calculations.

2. **`analyticsAgent.ts`**:
   - **Role:** Senior Strategic Analyst.
   - **Responsibility:** Analyzes raw research data to identify key drivers, economic impacts, risk factors, and required skills.

3. **`finalConclusionAgent.ts`**:
   - **Role:** Professor Synthesis Agent.
   - **Responsibility:** Combines facts and analytics into an authoritative, structured academic report with executive summaries and actionable takeaways.

4. **`deepResearchAgent.ts`**:
   - Unified master agent definition with access to all tools and generalized professor-grade instructions.

---

## 🌐 Tools & MCP Integration

1. **Live Parallel MCP Web Search (`src/mcp/webSearchTool.ts`)**:
   - Connects via JSON-RPC to the **Parallel AI Remote MCP Server** (`https://search.parallel.ai/mcp`).
   - Executes `web_search` queries and returns live titles, URLs, and real-time excerpts.

2. **Country Demographics Tool (`src/mastra/tools/index.ts`)**:
   - Provides baseline demographic data, capitals, and country facts.

3. **Calculator Tool (`src/mastra/tools/index.ts`)**:
   - Performs exact percentage, addition, subtraction, multiplication, and division math.
   - Uses `z.coerce.number()` schema validation to handle string-number arguments safely across LLMs.

---

## ⚙️ Workflow Pipeline (`src/mastra/deepagent-workflow/`)

The workflow is constructed using Mastra 1.x `createWorkflow`:

- **Step 1 (`webResearchStep`):** Runs `researchAgent` $\rightarrow$ outputs raw web research & facts.
- **Step 2 (`analyticsStep`):** Runs `analyticsAgent` $\rightarrow$ outputs strategic breakdown & trends.
- **Step 3 (`finalConclusionStep`):** Runs `finalConclusionAgent` $\rightarrow$ outputs final synthesized report.

```typescript
// src/mastra/deepagent-workflow/workflow.ts
export const deepResearchWorkflow = createWorkflow({
  id: 'deep-research-workflow',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ finalReport: z.string() }),
})
  .then(webResearchStep)
  .then(analyticsStep)
  .then(finalConclusionStep)
  .commit();
```

---

## ⚡ LLM Providers & Environment Setup (`.env`)

- **Primary Provider:** **Groq Cloud API** (`llama-3.3-70b-versatile`)
  - **Speed:** Sub-second LPU inference (500+ tokens/sec).
  - **Quota:** 100,000+ free tokens per day (resets daily).
- **Secondary Provider:** **NVIDIA NIM API** (`meta/llama-3.3-70b-instruct` / `meta/llama-3.1-8b-instruct`).

---

## 🧹 Recent Code Cleanup & Maintenance

1. **Removed Duplicate File:** Deleted `/src/mastra/agents/deepReasearchAgent.ts` (typo filename) and consolidated all exports into `/src/mastra/agents/deepResearchAgent.ts`.
2. **Updated Import References:** Aligned all imports in `src/mastra/index.ts` and workflow step files to point to the clean `deepResearchAgent.ts`.
3. **Verified Execution:** Tested live 3-step workflow execution using `npx tsx src/index.ts` (~9-15 seconds total pipeline runtime).

---

## 💻 How to Run

```bash
# Run the full 3-step Deep Research Workflow
npm run dev
# OR
npx tsx src/index.ts
```
