# cheerfulbeast-portfolio

Mark Levi Rowse M. Ramos's portfolio site — [cheerfulbeast-portfolio.vercel.app](https://cheerfulbeast-portfolio.vercel.app).

A single-page Next.js site with a terminal-boot intro, a command palette, and a
hand-rolled ASCII galaxy animation, in front of the usual projects / experience /
skills / contact sections.

## Stack

- Next.js 15 (App Router) + React 18 + TypeScript
- The actual page (`src/app/page.tsx`) is hand-written CSS in `src/app/globals.css`,
  not Tailwind utility classes or the shadcn/ui components below
- `react-starfield` for the background canvas
- Deployed on Vercel

## Structure

```
src/
  app/
    page.tsx       — the entire site: intro gate, hero, projects, experience, skills, contact
    globals.css     — all custom styling (terminal chrome, cards, lightbox, palette, etc.)
    layout.tsx
  lib/
    portfolio-data.tsx  — projects / experience / skills content (edit this to update copy)
  components/ui/    — shadcn primitives from initial scaffolding; not currently
                       imported by the page (Tailwind + shadcn are configured
                       and ready to use, just unused today)
public/             — project screenshots and logos referenced by portfolio-data.tsx
```

To change project cards, job history, or skills, edit `src/lib/portfolio-data.tsx` — the
page renders straight from those arrays.

## Notable bits

- **Terminal intro gate** — a scripted boot sequence with a real mini command line
  (`help`, `whoami`, `ls`, `cat status.txt`, `open github`, `sudo`, `matrix`, …).
  Skippable, and the choice is remembered.
- **Command palette** (`⌘K` / `Ctrl+K`) — jump to any section or run the same commands
  as the terminal.
- **ASCII galaxy** — a fixed character-grid spiral animation, rendered into a `<pre>`
  on an interval (no canvas, no layout jitter).
- **Project lightbox** — cards with an `images` array in `portfolio-data.tsx` open a
  screenshot carousel instead of linking out; cards with only a `link` open the live
  site in a new tab.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

No environment variables are required for local dev — the site has no backend, it's
static content plus client-side interactivity.
