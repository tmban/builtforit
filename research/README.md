# Path Research Agent

This folder contains the research agent used to generate deep knowledge profiles for each path in the game.

## What it does

Runs Claude (with web search) against each of the 35 paths and produces a structured JSON profile covering:
- What the path actually requires
- Common failure modes
- Green and red flags
- Age relevance
- Generated questions (10 MC + 2 open-ended)
- Verdict thresholds

## How to run it

The agent is a standalone React component. To run it:

1. Create a new CodeSandbox (react template)
2. Paste `PathResearchAgent.jsx` as the main component
3. Temporarily add your Anthropic API key (remove after)
4. Hit "Run All Research"
5. Download the JSON when complete
6. Save it as `path_research.json` in this folder

## Output

`path_research.json` — the knowledge base used by the main app for question generation and verdict quality. Commit this to the repo after running.

## When to re-run

- When adding new paths
- When existing path research feels outdated (every 6–12 months)
- When you want to improve question quality for a specific path
