# PR Reviewer Agent System: Context & Architecture

This document tracks the technical context, architecture, tools, agents, and workflows for the **Automated GitHub PR Reviewer & Interactive Human Approval System**.

---

## 🎯 Overview

The **PR Reviewer System** is an AI-powered code auditing tool built with Mastra and GitHub's REST API. It fetches PR git diff patches and file modifications directly from GitHub, executes parallel quality and performance audits, synthesizes an executive PR report, and **interactively prompts the human reviewer with options (`yes` / `no` / `view`) before posting to GitHub**.

---

## 🏗️ Interactive System Architecture

```
GitHub Repository / PR Input (owner, repo, pullNumber)
   │
   ▼
Step 1: fetchPRStep ──► githubPRTool (src/mastra/tools/githubPRTool.ts)
   │
   ▼
Step 2: auditPRStep ──► qualityAgent (Code Quality, Types, Error Handling)
                    ──► performanceAgent (Complexity, Memory Leaks, Async)
   │
   ▼
Step 3: reviewSynthesisStep ──► prReviewerAgent (Generates PR Review Report)
   │
   ▼
Interactive Human Approval Loop (src/prIndex.ts)
   ├── Type "yes"  ──► postPRReviewTool (Publishes Exact Review to GitHub)
   ├── Type "view" ──► Prints Full Line-by-Line Markdown Comment in Terminal
   └── Type "no"   ──► Prompts for Feedback ──► Re-generates with prReviewerAgent
```

---

## 🛠️ Tools (`src/mastra/tools/`)

1. **`githubPRTool.ts`**:
   - Uses GitHub REST API (`https://api.github.com/repos/{owner}/{repo}/pulls/{pullNumber}`) with `GITHUB_TOKEN`.
   - Returns PR metadata, branch SHAs, modified file paths, line change stats, and exact patch diffs.

2. **`postPRReviewTool.ts`**:
   - Submits an official GitHub PR Review (`POST /repos/{owner}/{repo}/pulls/{pullNumber}/reviews`).
   - Includes 3-attempt exponential backoff retry for transient GitHub 503/502 server errors.

---

## 🤖 Agents (`src/mastra/agents/pr/`)

1. **`qualityAgent.ts`**: Audits code quality, type safety, and clean code principles.
2. **`performanceAgent.ts`**: Audits time/space complexity, memory leaks, and async bottlenecks.
3. **`prReviewerAgent.ts`**: Master PR Reviewer & feedback refinement agent.

---

## 🔑 Environment Configuration (`.env`)

- `GITHUB_TOKEN`: Fine-grained or Classic Personal Access Token with `Pull requests (Read & write)` permissions.
