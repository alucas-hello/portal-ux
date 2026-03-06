# HelloCollege Employee Portal — Prototype

## Project Overview
Interactive React prototype for the redesigned HelloCollege Employee Portal.
This is a **design prototype**, not a production app — the goal is to explore UX patterns,
validate layouts, and gather stakeholder feedback before handing off to engineering.

## Tech Stack
- **Vite 6** — dev server & build
- **React 18** — UI framework
- **Tailwind CSS 3** — utility-first styling
- No router, no state management library — single-page prototype with internal nav

## Quick Start
```bash
npm install
npm run dev        # starts on http://localhost:3000
npm run build      # production build → dist/
```

## Brand Guidelines

### Colors (use exact hex values)
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-dark` | `#281d51` | Sidebar, headings, tooltips |
| `brand-medium` | `#55478f` | Top bar, logo background, accents |
| `brand-light` | `#8e7bb7` | Hover states, secondary accents |
| `brand-pale` | `#c0bad4` | Borders, "not started" status, muted text |
| `brand-magenta` | `#ff3467` | Alerts, "behind schedule" status, destructive actions |
| `brand-teal` | `#42778c` | Teal accent (links, secondary buttons) |
| `brand-cyan` | `#00e6c3` | Success, "completed" status |
| `text-dark` | `#474747` | Primary body text |
| `text-light` | `#b2b2b2` | Labels, secondary text |
| In-progress | `#fbbf24` | Yellow, "in progress" status only |

### Status Colors
- **Not started:** `#c0bad4` (pale purple)
- **In progress:** `#fbbf24` (yellow)
- **Completed:** `#00e6c3` (cyan)
- **Behind schedule:** `#ff3467` (magenta)

### Typography
- **Primary font:** Montserrat (400, 500, 600, 700, 800)
- **Display font:** Permanent Marker (decorative headings only)
- Loaded via Google Fonts in `index.html`

### Logo
- Do **NOT** attempt to recreate the shield logo as SVG
- Use the `LogoMark` component (Montserrat "HC" on a rounded purple square) as placeholder
- Swap with actual PNG/SVG asset when brand files are available

## Architecture

### File Structure
```
src/
  App.jsx          ← entire prototype (single-file for now)
  main.jsx         ← React mount point
  index.css        ← Tailwind directives + scrollbar styles
```

### Key Design Decisions
1. **No accordions** — information should be visible, not hidden
2. **No trash/eye/pencil action icons** — use contextual actions instead
3. **No dead white space** — cards should be dense and information-rich
4. **Icon-based collapsible sidebar** — expands on hover, icons always visible
5. **Card-based dashboards** — student cards like social media posts, not table rows
6. **Role-based views** — Admin / Counselor / Essay Coach / Tutor switcher in top bar
7. **Timeline visualizations** — task & workshop progress shown as icon dot rows on dashboard cards
8. **Recent students** — 10 most recent in sidebar chips, not top bar

### Pages & Roles
| Page | Admin | Counselor | Essay Coach | Tutor |
|------|:-----:|:---------:|:-----------:|:-----:|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Colleges | ✓ | ✓ | | |
| High Schools | ✓ | ✓ | | |
| Registration | ✓ | ✓ | | |
| Time Tracker | ✓ | ✓ | ✓ | ✓ |
| Reports | ✓ | | | |
| Programs | ✓ | | | |
| Services | ✓ | | | |
| Settings | ✓ | | | |

## Audit Reference
`portal-audit.json` contains the complete field-level audit of the legacy portal
(17 pages, 325+ fields). Use this as the source of truth to ensure no data is lost
in the redesign.

## Convention Notes
- All icons are inline SVG — no external icon libraries
- Prefer Tailwind classes; use inline `style={}` only for exact brand hex values
  not in the Tailwind config
- Component naming: PascalCase, descriptive (e.g., `TimelineDot`, `MetricChip`)
- Keep everything in `src/App.jsx` until ready to split into modules
