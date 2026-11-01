# PartyPilot 🎉

> **GenAI-powered celebration and event planner** — Plan weddings, birthdays, and community events with smart budgets, personalized timelines, vendor checklists, and AI-generated ideas. Built with React + Vite and powered by Google Gemini.

---

## Features

- 📋 **Event Setup Form** — Guided form for event type, budget, guest count, date, city, and theme with full inline validation
- 💰 **Budget Breakdown** — Intelligent allocation across 7 categories (venue, catering, décor, entertainment, photography, attire, contingency) with per-guest costs and visual bars
- 📅 **Planning Timeline** — Dated task list counting back from event date; short-notice detection and overdue flagging
- ✅ **Vendor Checklist** — Per-event-type checklist with localStorage persistence, progress bar, and custom item support
- 🤖 **AI Ideas Panel** — Gemini-powered personalized ideas (decor, food, activities, budget tips, local experiences). Falls back to curated templates with zero broken screens.
- 📋 **Copy Plan** — One-click copy of full plan as plain text

---

## Architecture

```
partyplanner/
├── api/
│   └── ideas.js              ← Vercel serverless Gemini proxy (server-only key)
├── src/
│   ├── config/
│   │   ├── budgetWeights.js  ← Single source of budget allocation weights
│   │   └── vendorTemplates.js← Checklist templates per event type
│   ├── utils/
│   │   ├── budget.js         ← Pure budget allocation functions
│   │   ├── timeline.js       ← Pure timeline generation functions
│   │   ├── validation.js     ← Pure form validation functions
│   │   └── fallbackIdeas.js  ← Static fallback ideas library
│   ├── hooks/
│   │   └── useLocalStorage.js← Safe localStorage hook
│   ├── components/
│   │   ├── Header.jsx        ← Sticky header + skip-to-content
│   │   ├── EventForm.jsx     ← Validated event setup form
│   │   ├── BudgetBreakdown.jsx← Memoised budget grid
│   │   ├── Timeline.jsx      ← Dated timeline with overdue badges
│   │   ├── VendorChecklist.jsx← Grouped checklist with progress bar
│   │   └── IdeasPanel.jsx    ← AI ideas with loading/fallback states
│   ├── __tests__/            ← Vitest + React Testing Library tests
│   ├── App.jsx               ← Root orchestrator
│   ├── main.jsx              ← React 18 entry point
│   └── index.css             ← Dark glassmorphism design system
├── index.html
├── vite.config.js
├── vercel.json
├── .env.example
└── package.json
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| Language | JavaScript (ES modules) |
| Styling | Vanilla CSS (dark glassmorphism) |
| Testing | Vitest + React Testing Library |
| AI Backend | Google Gemini API (serverless, Vercel) |
| Deployment | Vercel |
| Fonts | Google Fonts (Inter + Outfit) |

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/partypilot.git
cd partypilot

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 4. Run the development server
npm run dev
```

The app runs at `http://localhost:5173`.

> **Note:** The Vite dev server does **not** run the serverless function locally. To test the AI locally, use `vercel dev` (requires Vercel CLI installed):
> ```bash
> npm i -g vercel
> vercel dev
> ```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes (for AI) | Google Gemini API key. Set in Vercel project settings — **never in the repo**. |
| `GEMINI_MODEL` | No | Model to use. Defaults to `gemini-2.0-flash`. |

Set these in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## How the Fallback Works

If `GEMINI_API_KEY` is not set, the API call fails, or a network timeout occurs:

1. The `/api/ideas` serverless function returns a `503` or `504` response with a generic message.
2. The `IdeasPanel` component catches the error and calls `getFallbackIdeas(eventType)`.
3. Curated ideas are rendered from `src/utils/fallbackIdeas.js`.
4. A small **"Offline ideas mode"** banner appears — no broken screens, ever.

---

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# Coverage report
npm run test:coverage
```

**Target: 12+ passing tests** across 5 test files:
- `budget.test.js` — allocation math, validation, all event types
- `timeline.test.js` — chronological order, overdue, short-notice
- `validation.test.js` — every invalid field case, boundaries
- `IdeasPanel.test.jsx` — loading, success, fallback, ARIA
- `EventForm.test.jsx` — errors, submission, accessibility

---

## Deployment

### Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Set the following environment variables in **Vercel Project Settings**:
- `GEMINI_API_KEY` — your Google Gemini API key
- `GEMINI_MODEL` — (optional) e.g. `gemini-2.0-flash`

The `vercel.json` at the root handles routing — no extra config needed.

### Build Validation

```bash
npm run build
```

Output goes to `dist/`. Check bundle size with `npx vite-bundle-visualizer` if needed.

---

## Design Decisions

### Security First
The Gemini API key **never leaves the server**. The `/api/ideas.js` serverless function reads it from `process.env` and is the sole AI touchpoint. The client never sees the key, even in network responses. AI output is validated against a strict JSON schema before forwarding to the client; `dangerouslySetInnerHTML` is never used.

### Graceful Degradation Over Broken Screens
The app has three layers of fallback: (1) if the AI key is unconfigured, (2) if the network call fails, (3) if the parsed response fails schema validation. In all cases, curated fallback ideas are shown with an "Offline ideas mode" notice. The app is fully functional without any AI.

### Pure Business Logic
All budget math, timeline generation, and form validation live in `src/utils/` as pure functions with no React imports. This makes them trivially testable and reusable.

### Single Config Object for Budget Weights
All budget allocation percentages live in `src/config/budgetWeights.js`. Changing a wedding category's allocation requires editing one number — no logic changes needed.

### localStorage with try/catch
The vendor checklist persists to localStorage but is wrapped in `try/catch` throughout `useLocalStorage.js`. The app works identically in private browsing mode where storage may be blocked.

### Accessibility as a First-Class Feature
Every input has a `<label>`, every error has `role="alert"`, loading states use `aria-live="polite"`, the progress bar uses `role="progressbar"` with correct `aria-valuenow/min/max`, and a skip-to-content link is provided. Focus rings are always visible.

---

## License

MIT
