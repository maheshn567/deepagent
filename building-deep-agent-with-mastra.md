# Building a Simple Deep Agent with Mastra ��

A beginner-friendly guide to understanding and implementing a simple Deep Agent using the Mastra framework.

> **Goal:** Understand the core concepts behind Deep Agents by building a very small agent that can reason about a request, decide when it needs a tool, use that tool, observe the result, and produce a final answer.

---

## Table of Contents

1. [What Are We Building?](#1-what-are-we-building)
2. [What Is a Deep Agent?](#2-what-is-a-deep-agent)
3. [What Is Mastra?](#3-what-is-mastra)
4. [Prerequisites](#4-prerequisites)
5. [Step 1 — Create a Mastra Project](#5-step-1--create-a-mastra-project)
6. [Step 2 — Understand the Project Structure](#6-step-2--understand-the-project-structure)
7. [Step 3 — Configure an LLM Provider](#7-step-3--configure-an-llm-provider)
8. [Step 4 — Create Your First Tool](#8-step-4--create-your-first-tool)
9. [Step 5 — Create the Agent](#9-step-5--create-the-agent)
10. [Step 6 — Connect the Tool to the Agent](#10-step-6--connect-the-tool-to-the-agent)
11. [Step 7 — Register the Agent in Mastra](#11-step-7--register-the-agent-in-mastra)
12. [Step 8 — Run the Agent](#12-step-8--run-the-agent)
13. [Step 9 — Understand the Agent Loop](#13-step-9--understand-the-agent-loop)
14. [Step 10 — Add a Second Tool](#14-step-10--add-a-second-tool)
15. [Step 11 — Understand Multi-Step Reasoning](#15-step-11--understand-multi-step-reasoning)
16. [Agent vs Tool vs Workflow](#16-agent-vs-tool-vs-workflow)
17. [What Makes This a Deep Agent?](#17-what-makes-this-a-deep-agent)
18. [Common Beginner Mistakes](#18-common-beginner-mistakes)
19. [What to Learn Next](#19-what-to-learn-next)
20. [Final Mental Model](#20-final-mental-model)

---

# 1. What Are We Building?

We are going to build a very simple **Research Agent**.

The user gives the agent a question.

For example:

> What is the capital of India?

The agent has access to a tool that can provide country information.

The agent decides that it needs the tool, calls it, receives the information, and then answers the user.

The basic architecture is:

**User → Agent → Tool → Tool Result → Agent → Final Answer**

This small example is enough to understand the foundation of a Deep Agent.

---

# 2. What Is a Deep Agent?

A normal LLM application often works like this:

**User → Prompt → LLM → Response**

The LLM receives a prompt and generates an answer.

An agent is different.

An agent can decide what action it should take to complete a task.

The basic agent loop is:

**User Request → Reason → Decide → Act → Observe → Decide Again → Final Answer**

For example:

1. The user asks a question.
2. The agent determines what information is required.
3. The agent decides whether a tool is necessary.
4. The agent calls the appropriate tool.
5. The tool returns a result.
6. The agent examines the result.
7. The agent decides whether another action is necessary.
8. The agent produces the final response.

This ability to work through multiple steps is the foundation of a Deep Agent.

---

# 3. What Is Mastra?

Mastra is a TypeScript framework for building AI applications and agents.

It provides building blocks for:

* Agents
* Tools
* Workflows
* Memory
* Model integrations
* Structured output
* Human-in-the-loop interactions
* Observability
* Evaluations

For this tutorial, we only need to understand three major concepts:

| Concept    | Purpose                            |
| ---------- | ---------------------------------- |
| **Agent**  | Decides what to do                 |
| **Tool**   | Performs a specific action         |
| **Mastra** | Organizes and runs the application |

Think of it this way:

**Agent = Brain 🧠**

**Tool = Hands 🔧**

**Mastra = Framework that connects everything together ⚙️**

---

# 4. Prerequisites

Before starting, you should have:

* Basic JavaScript or TypeScript knowledge
* Node.js installed
* npm or another package manager
* An API key for a supported LLM provider
* Basic understanding of how environment variables work

You do not need advanced AI knowledge.

You also do not need to understand:

* Multi-agent systems
* RAG
* MCP
* Vector databases
* Advanced workflows
* Long-term memory

Those concepts can be learned later.

The goal here is to understand the simplest possible agent architecture first.

---

# 5. Step 1 — Create a Mastra Project

Start by creating a new Mastra project using the Mastra CLI.

The CLI creates the basic application structure for you.

During project creation, choose the options appropriate for a basic agent application.

Once the project is created, move into the project directory and install the dependencies.

At this point, you should have a working Mastra project.

### Checkpoint ✅

Before continuing, make sure:

* The project starts successfully.
* Dependencies are installed.
* The development environment runs without errors.

If the basic Mastra project does not run, fix that before adding the agent.

---

# 6. Step 2 — Understand the Project Structure

A simple Mastra application will typically have a structure similar to:

**Project**

→ `src`

→ `mastra`

→ `agents`

→ `tools`

→ application entry point

The exact structure can vary depending on the Mastra version and project template.

For this tutorial, think about the project in terms of responsibilities rather than exact filenames.

### Agents

The agent definition lives here.

The agent contains:

* Its name
* Its instructions
* The model it uses
* The tools it can access

### Tools

Tools contain actions that the agent can perform.

Examples:

* Search the web
* Query a database
* Read a file
* Call an API
* Perform calculations
* Create a document

### Mastra Application

The Mastra configuration brings the agents and other components together.

The conceptual structure is:

**Mastra Application**

→ Agent

→ Tools

→ Workflows

→ Memory

For our first example, we only need:

**Mastra → Agent → Tool**

---

# 7. Step 3 — Configure an LLM Provider

An agent needs a language model.

The model is responsible for reasoning about the user's request and deciding which action to take.

For example:

**User:**

> What is the capital of India?

The model might determine:

> I need country information to answer this accurately.

It then requests the appropriate tool.

Your API key should be stored in an environment variable rather than directly inside your source code.

### Important

Never commit API keys to Git.

Use environment variables and keep your environment configuration outside your source repository.

### Checkpoint ✅

At this stage you should have:

* A Mastra project
* An LLM provider configured
* A working API key
* A development environment that starts successfully

---

# 8. Step 4 — Create Your First Tool

Now we introduce the most important concept after the agent itself: **tools**.

A tool is simply a capability that the agent can use.

Imagine that your agent is a person.

The agent has a brain, but it cannot directly access your database or external systems.

You give it tools.

For example:

**Agent**

→ Search Tool

→ Database Tool

→ Calculator Tool

→ Email Tool

→ File Tool

The agent decides when to use these tools.

---

## Our First Tool

For learning purposes, create a simple **Country Information Tool**.

The tool should be capable of providing information such as:

* Country name
* Capital
* Population
* Continent

For example, the tool might receive:

> India

and return information about India.

The important concept is not the country data itself.

The important concept is:

**The agent does not know how the tool works internally.**

The agent only knows:

> "I have a tool that can provide country information."

The tool implementation handles the actual operation.

---

# 9. Step 5 — Create the Agent

Now create your first agent.

The agent needs four important things:

### 1. Identity

Give the agent a name such as:

**Research Agent**

### 2. Instructions

Tell the agent what it is supposed to do.

For example:

> You are a helpful research assistant.

Then explain:

* What type of questions it handles
* When it should use the country information tool
* That it should not invent information
* How it should respond after receiving tool results

### 3. Model

Specify the language model the agent should use.

The model is responsible for reasoning and deciding what to do.

### 4. Tools

Give the agent access to the tools it is allowed to use.

The conceptual configuration becomes:

**Research Agent**

* Instructions
* Model
* Country Information Tool

---

# 10. Step 6 — Connect the Tool to the Agent

This is where the agent becomes more useful.

The tool exists independently.

The agent also exists independently.

Now we connect them.

The relationship becomes:

**Research Agent**

↓

**Country Information Tool**

This means the agent is allowed to use that tool.

However, this does **not** mean the tool will execute every time.

The agent decides whether the tool is necessary.

For example:

### User asks:

> What is the capital of India?

The agent can decide:

**Tool required → Country Information Tool**

But if the user asks:

> What is an AI agent?

The agent may decide:

**Tool not required → Answer directly**

This decision-making ability is a fundamental part of agent behavior.

---

# 11. Step 7 — Register the Agent in Mastra

Creating an agent is not enough.

Mastra also needs to know that your agent exists.

Register the agent with the Mastra application.

Conceptually:

**Mastra Application**

↓

**Research Agent**

↓

**Country Information Tool**

Once registered, the Mastra runtime can expose and run your agent.

### Checkpoint ✅

At this point, verify that:

* Your agent exists.
* Your tool exists.
* The tool is connected to the agent.
* The agent is registered with Mastra.
* The application starts successfully.

---

# 12. Step 8 — Run the Agent

Start the Mastra development environment.

Depending on your project template and Mastra version, the development environment may provide an interface for interacting with your agent.

Ask:

> What is the capital of India?

The expected conceptual behavior is:

**User**

↓

"What is the capital of India?"

↓

**Agent**

↓

"I need country information."

↓

**Country Information Tool**

↓

Returns information about India

↓

**Agent**

↓

Generates the final response

↓

**User**

> The capital of India is New Delhi.

---

# 13. Step 9 — Understand the Agent Loop

This is the most important section of the tutorial.

Do not just focus on making the application run.

Understand what happened internally.

---

## The Basic Loop

The agent operates conceptually like this:

### Step 1 — Receive

The agent receives the user's request.

> What is the capital of India?

### Step 2 — Reason

The model analyzes the request.

It determines that country information is needed.

### Step 3 — Decide

The agent chooses the appropriate tool.

> Country Information Tool

### Step 4 — Act

Mastra executes the tool.

### Step 5 — Observe

The tool returns information.

For example:

> Country: India
> Capital: New Delhi

### Step 6 — Reason Again

The model receives the tool result.

It now has enough information to answer.

### Step 7 — Respond

The agent produces the final answer.

---

## Visualizing the Loop

**User Request**

↓

**Agent Reasoning**

↓

**Tool Selection**

↓

**Tool Execution**

↓

**Tool Result**

↓

**Agent Reasoning**

↓

**Final Answer**

The critical point is that the agent can return to the reasoning stage after a tool call.

That is what makes the architecture different from a simple one-shot LLM call.

---

# 14. Step 10 — Add a Second Tool

Once the first tool works, add another tool.

A good example is a **Calculator Tool**.

The calculator can perform:

* Addition
* Subtraction
* Multiplication
* Division

Now your agent has two capabilities:

**Research Agent**

→ Country Information Tool

→ Calculator Tool

---

## Why Add a Second Tool?

Because now the agent has to choose.

Consider these requests.

### Request A

> What is the capital of India?

The agent should select:

**Country Information Tool**

### Request B

> What is 25 multiplied by 40?

The agent should select:

**Calculator Tool**

### Request C

> Explain what an AI agent is.

The agent may select:

**No tool**

This demonstrates an important concept:

> The agent is not simply executing a fixed sequence of functions. It decides which capability is appropriate for the current request.

---

# 15. Step 11 — Understand Multi-Step Reasoning

Now we can make the task slightly more complex.

Imagine the user asks:

> Find India's population and calculate 10% of it.

Conceptually, the agent may perform:

**User Request**

↓

**Agent**

↓

"I need India's population."

↓

**Country Information Tool**

↓

Population information

↓

**Agent**

↓

"I need to calculate 10%."

↓

**Calculator Tool**

↓

Calculation result

↓

**Agent**

↓

Final answer

This is a multi-step agent task.

The important part is that the agent does not necessarily know all the steps in advance.

It can determine the next action based on the result of the previous action.

---

# 16. Agent vs Tool vs Workflow

These three concepts are easy to confuse.

Understanding their difference is extremely important.

---

## Tool

A tool performs an action.

Examples:

* Search
* Calculate
* Query database
* Send email
* Read file

Think:

> **Tool = What can I do?**

---

## Agent

An agent decides what action should happen next.

Think:

> **Agent = What should I do next?**

The agent can choose:

* Use a tool
* Use another tool
* Use several tools
* Answer directly
* Ask the user for more information

---

## Workflow

A workflow defines a controlled sequence of operations.

For example:

**Step 1**

Validate input

↓

**Step 2**

Run research agent

↓

**Step 3**

Validate result

↓

**Step 4**

Request human approval

↓

**Step 5**

Send final result

Think:

> **Workflow = What process should happen and in what order?**

---

## Simple Comparison

| Component | Main Responsibility                            |
| --------- | ---------------------------------------------- |
| Agent     | Decides what to do                             |
| Tool      | Performs an action                             |
| Workflow  | Controls a process                             |
| Model     | Provides reasoning and language generation     |
| Mastra    | Provides the framework connecting these pieces |

---

# 17. What Makes This a Deep Agent?

At this point, our application is still very small.

So why call it a Deep Agent?

The important idea is **not the number of lines of code**.

The important idea is the ability to work through a task using multiple reasoning and action cycles.

A basic LLM interaction looks like:

**Prompt → Response**

A basic agent looks like:

**Prompt → Reason → Tool → Response**

A more advanced Deep Agent can look like:

**Prompt**

↓

**Plan**

↓

**Tool**

↓

**Observe**

↓

**Reason**

↓

**Tool**

↓

**Observe**

↓

**Reason**

↓

**Tool**

↓

**Synthesize**

↓

**Final Result**

The deeper the task, the more reasoning and action cycles may be required.

---

# 18. Common Beginner Mistakes

## Mistake 1 — Thinking an Agent Is Just a Prompt

An agent is more than instructions.

It combines:

* Model
* Instructions
* Tools
* Context
* State
* Execution

The model provides reasoning, but the surrounding system gives it capabilities.

---

## Mistake 2 — Giving the Agent Too Many Tools

Do not start with dozens of tools.

Start with:

**One Agent + One Tool**

Then move to:

**One Agent + Two Tools**

Then gradually increase complexity.

This makes it much easier to understand agent behavior.

---

## Mistake 3 — Making Every Operation an AI Decision

Not everything needs an LLM.

For example:

* Basic arithmetic
* Authentication
* Permission checks
* Database transactions
* Input validation

should usually be handled by deterministic code.

A good principle is:

> **Use AI for decisions and interpretation. Use normal code for guarantees.**

---

## Mistake 4 — Expecting the Agent to Always Choose Correctly

LLMs are probabilistic.

An agent may sometimes:

* Choose the wrong tool
* Use a tool unnecessarily
* Misinterpret a result
* Need better instructions

This is normal.

Agent development involves testing, evaluation, and improving tool descriptions and instructions.

---

## Mistake 5 — Giving an Agent Too Much Authority

Be careful when tools can:

* Delete data
* Send emails
* Make payments
* Modify production systems
* Publish content
* Change user permissions

For sensitive operations, introduce validation or human approval.

---

# 19. What to Learn Next

Once you understand the simple agent, continue learning in this order.

---

## Level 1 — Agent Fundamentals

Understand:

* Agent
* Model
* Instructions
* Tool
* Tool calling
* Agent loop

You should be able to explain:

> How does the agent decide when to use a tool?

---

## Level 2 — Multiple Tools

Learn how an agent can choose between several tools.

Example:

**Research Agent**

→ Search

→ Database

→ Calculator

→ File Reader

---

## Level 3 — Multi-Step Tasks

Learn how an agent can:

* Use one tool
* Inspect the result
* Decide what to do next
* Use another tool
* Combine the results

---

## Level 4 — Memory

Learn how agents maintain context across interactions.

For example:

> User: My name is Alex.

Later:

> User: What is my name?

Memory allows the agent to retain useful information.

---

## Level 5 — Workflows

Learn how to combine dynamic agents with deterministic processes.

Example:

**Workflow**

→ Validate

→ Agent Research

→ Validate Result

→ Human Approval

→ Deliver

---

## Level 6 — Human-in-the-Loop

Learn how to pause an agent and ask a human for approval before performing sensitive actions.

---

## Level 7 — Sub-Agents

Eventually, you can create specialized agents.

For example:

**Orchestrator Agent**

→ Research Agent

→ Analysis Agent

→ Writing Agent

Each agent has a focused responsibility.

---

## Level 8 — Production Deep Agents

Finally, learn:

* Observability
* Logging
* Evaluation
* Error handling
* Retries
* Security
* Permissions
* Cost management
* Long-running tasks
* Memory architecture

---

# 20. Final Mental Model

The easiest way to remember the whole concept is this:

## 🧠 Agent = Brain

The agent decides:

> What should I do next?

## 🔧 Tool = Capability

The tool performs:

> The action the agent requested.

## 👀 Observation = Result

The agent receives:

> What happened after the action?

## 🔄 Agent Loop = Reasoning Cycle

The agent then asks:

> What should I do next based on this result?

## ⚙️ Mastra = Framework

Mastra provides the infrastructure for putting these components together.

---

## The Complete Concept

**User**

↓

**Agent**

↓

**Reason**

↓

**Choose Tool**

↓

**Execute Tool**

↓

**Observe Result**

↓

**Reason Again**

↓

**Choose Next Action**

↓

**Execute**

↓

**Repeat if necessary**

↓

**Final Answer**

---

# Final Takeaway 🚀

Do not try to understand Deep Agents by starting with a complicated multi-agent system.

Start with the smallest possible mental model:

> **An agent is an LLM that can decide what action to take and use tools to perform that action.**

Then add complexity gradually:

**Agent**

↓

**Agent + Tool**

↓

**Agent + Multiple Tools**

↓

**Multi-Step Agent**

↓

**Agent + Memory**

↓

**Agent + Workflow**

↓

**Multi-Agent System**

↓

**Production Deep Agent**

If you understand the first four stages clearly, the more advanced Mastra concepts become much easier to understand.

The most important loop to remember is:

> **Reason → Act → Observe → Reason → Act → Observe → Finish**

That loop is the foundation of the Deep Agent concept.
