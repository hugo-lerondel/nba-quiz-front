# NBA Quiz Front

Application de quiz NBA — Progressive Web App built with React & TypeScript.

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vite.dev) | Build tool & dev server |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app) | PWA support (service worker, manifest) |
| [Biome](https://biomejs.dev) | Linter & formatter |
| [Lefthook](https://github.com/evilmartians/lefthook) | Git hooks (pre-commit lint) |

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server at `http://localhost:5173` |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run Biome checks |
| `bun run lint:fix` | Run Biome checks and auto-fix |
| `bun run format` | Format all files with Biome |

## Deployment

The app is automatically deployed to **GitHub Pages** on every push to `main` via GitHub Actions.  
Live URL: `https://hugo-lerondel.github.io/nba-quiz-front/`
