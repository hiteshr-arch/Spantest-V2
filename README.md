# Spantest

> Turn user stories into test cases & automation scripts — powered by AI.

Spantest is a developer productivity tool that converts plain-language user stories into structured test cases, BDD/Gherkin scripts, and ready-to-run automation code. It combines an AI generation pipeline with full manual CRUD so teams can manage their entire test suite from a single interface.

---

## Features

- **Chat-Driven Test Generation** — Describe what you want to test in a conversational chat panel. The AI asks whether you're testing at UI or API level, then whether you want scenarios or test cases directly — no forms, no steps
- **Scenario → Test Case Flow** — Generate high-level scenarios first, review and select them, then expand into full test cases with steps. Jump back to scenarios at any time via the chat link
- **Script Export** — Generate automation scripts for Playwright, Cypress, Jest, or Selenium with one click; copy to clipboard or export as `.ts`
- **Test Case CRUD** — Add, inline-edit, and delete individual or bulk test cases; row-level save/cancel prevents accidental edits
- **File Attachments in Chat** — Attach images, PDFs, specs, or code files alongside your prompt; previewed inline in the conversation
- **Repository** — Save generated test cases and scripts into a folder-organised repository. Create folders, move items between them, and view full item content in a side drawer
- **Project Management** — Organise test suites into projects with framework tags and activity tracking
- **Token Balance** — Track AI token usage by action, view cost-per-action breakdowns, top up with one-time packs, and review a full transaction history
- **Jira Integration** — Import user stories directly from Jira tickets

---

## Tech Stack

### Core

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | 5.9 |
| UI Framework | React | 19 |
| Build Tool | Vite | 8 |
| Routing | React Router | 7 |
| State Management | Redux Toolkit | 2 |

### UI & Styling

| Layer | Technology | Version |
|---|---|---|
| Component Library | Ant Design | 6 |
| Styling | SCSS Modules + CSS custom properties | — |
| CSS Pre-processor | Dart Sass | 1.98 |
| Display Font | Bricolage Grotesque | Google Fonts |
| Body Font | DM Sans | Google Fonts |
| Mono Font | Fira Code | Google Fonts |

### Tooling

| Tool | Purpose |
|---|---|
| ESLint 9 + typescript-eslint | Linting & type-aware rules |
| `@vitejs/plugin-react` | Fast Refresh + JSX transform |
| `tsc --noEmit` | Type checking |

---

## Design System

Spantest uses a custom **"Lavender Cloud"** theme built entirely on CSS custom properties:

```css
/* Colours */
--accent:          #7c3aed;   /* primary violet */
--accent-hover:    #6d28d9;
--accent-subtle:   rgba(124, 58, 237, 0.06);
--bg:              #f3f0fb;   /* page background */
--surface:         #ffffff;   /* card surface */
--surface-raised:  #faf9ff;
--text-primary:    #0f0a1e;
--text-secondary:  #4c4568;
--text-muted:      #8b87a0;

/* Typography */
--font-display:    'Bricolage Grotesque', system-ui;
--font-sans:       'DM Sans', system-ui;
--font-mono:       'Fira Code', ui-monospace;

/* Shadows */
--shadow-sm: 0 1px 4px rgba(124,58,237,0.06);
--shadow-md: 0 4px 16px rgba(124,58,237,0.08);
--shadow-lg: 0 8px 32px rgba(124,58,237,0.12);
```

**Visual details:**
- Three-layer radial gradient mesh background for soft purple depth
- Frosted glass topbar and sidebar via `backdrop-filter: blur()`
- Cards lift with `translateY(-3px)` on hover
- Ant Design `ConfigProvider` fully themed with violet tokens

---

## Project Structure

```
src/
├── components/
│   ├── generator/
│   │   ├── ChatPanel.tsx           # Left panel — chat conversation interface
│   │   ├── ChatMessageList.tsx     # Scrollable message thread with typing indicator
│   │   ├── ChatBubble.tsx          # Individual message bubble (user / system) with attachments & action links
│   │   ├── ChatInput.tsx           # Textarea + file attach button + attachment preview chips
│   │   ├── QuickReplyBar.tsx       # Pill buttons for binary choices (UI/API, Scenarios/Test Cases)
│   │   ├── ArtifactPanel.tsx       # Right panel — renders ScenarioList or TestCaseTable
│   │   ├── ScenarioList.tsx        # Scenario cards with multi-select, inline edit, CRUD
│   │   ├── TestCaseTable.tsx       # CRUD table — row-level edit / save / delete / step management
│   │   ├── ScriptBlock.tsx         # Syntax-highlighted code export panel with copy/export
│   │   └── SaveToRepositoryModal.tsx  # Folder picker modal for saving items to Repository
│   ├── repository/
│   │   └── ItemViewDrawer.tsx      # Side drawer — shows full Script / Test Case / Scenario content
│   └── ui/
│       ├── StatCard.tsx            # Dashboard metric card with accent bar
│       ├── ProjectCard.tsx         # Project grid card with status badge
│       └── TokenBadge.tsx          # Token count pill in topbar
├── layouts/
│   └── ShellLayout.tsx             # Frosted-glass topbar + sidebar nav
├── pages/
│   ├── DashboardPage.tsx           # Stat cards + project grid
│   ├── GeneratorPage.tsx           # Chat-driven AI generation — split-screen layout
│   ├── LibraryPage.tsx             # Repository — folder tree + items table + item view drawer
│   ├── TokensPage.tsx              # Balance, usage charts, pricing cards, activity log
│   ├── JiraPage.tsx                # Jira story import
│   └── ConfigPage.tsx              # App settings
├── store/
│   ├── spantestSlice.ts            # Redux slice — projects, chat, scenarios, repository
│   ├── store.ts                    # Redux store config
│   └── hooks.ts                    # useAppDispatch / useAppSelector
├── services/
│   ├── generatorApi.ts             # AI generation API (mocked — ready for backend)
│   └── jiraApi.ts                  # Jira ticket API (mocked)
├── config/
│   └── pricing.ts                  # TOKEN_COSTS constants
├── styles/
│   ├── theme.scss                  # CSS custom property design tokens
│   └── global.scss                 # Base reset + gradient mesh + scrollbar
└── types/
    └── generator.ts                # All TypeScript types — TestCase, Scenario, Chat, Repository
```

---

## Generator Flow

The generator uses a **conversation state machine** instead of a step wizard:

```
User types prompt
  → System: "UI or API level testing?" [UI] [API]
  → API  → generates test cases directly → TestCaseTable on right
  → UI   → "Scenarios or Test Cases?" [Scenarios] [Test Cases]
             → Scenarios   → ScenarioList on right → select → Generate Test Cases
             → Test Cases  → TestCaseTable on right

After test cases are shown:
  → Select test cases → Generate Script → ScriptBlock
  → Save to Repository → choose/create folder → items saved
  → Type a new prompt → right panel resets, conversation restarts
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
# Clone the repo
git clone https://github.com/hiteshr-arch/Spantest-V2.git
cd Spantest-V2

# Install dependencies
npm install

# Start dev server → http://localhost:5173
npm run dev

# Type-check (zero errors expected)
npx tsc --noEmit

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | KPI stat cards + project grid + new project flow |
| `/project/:id/generator` | Generator | Chat-driven AI test generation with split-screen layout |
| `/project/:id/library` | Repository | Folder-organised saved test cases, scenarios, and scripts |
| `/tokens` | Token Balance | Usage breakdown, top-up packs, transaction history |
| `/project/:id/jira` | Jira Import | Connect and import user stories from Jira |
| `/config` | Settings | App configuration |

---

## Scripts

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Type-check + Vite production build
npm run lint      # ESLint with typescript-eslint rules
npm run preview   # Serve the production build locally
```

---

## Repository

**GitHub:** https://github.com/hiteshr-arch/Spantest-V2
