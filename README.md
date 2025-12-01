# e2e-supervisor
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/cannarocks/mastra-workflow)

Workflow orchestrator for AI agents focused on automating and enhancing interactions with the [UNGUESS](https://unguess.io) platform. Built on [Mastra](https://mastra.ai/) for multi-step workflow management, it enables advanced QA automation and intelligent actions on [app.unguess.io](https://app.unguess.io). Stagehand by Browserbase is used as a backend for browser automation, but the main focus is on UNGUESS-centric workflows.

## Overview

This project empowers AI agents to execute multi-step workflows that interact with [app.unguess.io](https://app.unguess.io), automating QA processes, data collection, and platform actions. The orchestration is handled by Mastra, enabling iterative information gathering, template selection, and plan creation tailored for UNGUESS use cases. Stagehand provides browser automation capabilities as needed.

## Features

- **UNGUESS Workflow Automation**: Multi-step workflows designed for actions and QA on app.unguess.io
- **Iterative Data Collection**: Conversational steps to gather all necessary information from the user
- **Template Selection**: AI-driven selection of the best test or QA template for UNGUESS activities
- **Global State Management**: Shared state across workflow steps for context-aware automation
- **Browser Automation**: Execute web actions on UNGUESS via Stagehand (secondary feature)
- **AI-Powered Reasoning**: Use OpenAI models for intelligent decision-making and interaction

## Installation

### Prerequisites

- Node.js (v20+)
- yarn
- Browserbase account
- OpenAI API access

### Setup

1. Clone the repository:

   ```
   git clone https://github.com/mastra-ai/e2e-supervisor.git
   cd e2e-supervisor
   ```

2. Install dependencies:

   ```
   yarn
   ```

3. Create a `.env` file with your API keys:
   ```
   BROWSERBASE_PROJECT_ID=your_project_id
   BROWSERBASE_API_KEY=your_api_key
   OPENAI_API_KEY=your_openai_key
   ```

## Usage

### Running the development server

```
yarn run dev
```

This will start the Mastra development server, exposing endpoints for UNGUESS workflow automation.

## Architecture

### Core Components

1. **UNGUESS Workflow Engine**
   - Multi-step workflows for QA and automation on app.unguess.io
   - Iterative user interaction and data gathering
   - Template selection and plan creation tailored for UNGUESS

2. **Mastra Agents**
   - Orchestrate workflow logic, decision-making, and state management

3. **Stagehand Integration**
   - Optional browser automation for executing actions on UNGUESS

### Flow Diagram

```
User Query → Mastra Workflow → Multi-step Data Collection → Template Selection → Actions on app.unguess.io → Results/Feedback
```

## Configuration

Customize agents, templates, and workflow logic in `src/mastra/agents/` and `src/mastra/steps/`. Main workflow logic is in `src/mastra/workflows/e2e-workflow.ts`.
