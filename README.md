# Am I Built For It?

A quiz app that tells you whether you're actually built for your dream path — footballer, DJ, startup founder, Love Island, and more.

## Tech stack

- React + Vite (frontend)
- Vercel (hosting + serverless functions)
- Anthropic Claude (AI verdict, scoring, advice)

## Project structure

```
builtforit/
├── src/
│   ├── App.jsx          ← main app
│   └── main.jsx         ← entry point
├── api/
│   └── verdict.js       ← serverless function (keeps API key safe)
├── research/
│   ├── PathResearchAgent.jsx  ← agent for generating path research
│   ├── path_research.json     ← generated knowledge base (run agent to create)
│   └── README.md
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## Local development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Add your Anthropic API key to .env.local
```

### 3. Run locally with Vercel dev (recommended — runs the API too)
```bash
npm install -g vercel
vercel dev
```

Or if you just want the frontend without API calls working:
```bash
npm run dev
```

## Deploy to Vercel

### First time
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select the repo — Vercel auto-detects Vite
4. Add environment variable: `ANTHROPIC_API_KEY` = your key
5. Click Deploy

### After that
Every `git push` to `main` triggers an automatic redeploy. That's it.

## Running the research agent

See `research/README.md` for instructions on running the path research agent to regenerate the knowledge base.

## Adding new paths

1. Run the research agent on the new path
2. Add the path to `ALL_PATHS` in `src/App.jsx`
3. Add the questions to `QUESTIONS` in `src/App.jsx`
4. Push to GitHub — Vercel deploys automatically
