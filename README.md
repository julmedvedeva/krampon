# krampon

## Getting Started (First-Time Setup)

### 1. Prerequisites

* **Node.js ≥ 22** (check with `node -v`)
* **npm ≥ 10** (or Yarn / pnpm – examples use npm)
* **Git**

### 2. Clone the Repository

```bash
git clone https://github.com/<your-org>/<repo>.git   # replace URL
cd <repo>
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run in Development Mode

```bash
npm run dev
```

Vite will start a dev server (default: http://localhost:5173) with hot-reload.

### 5. Build for Production

```bash
npm run build        # outputs to dist/
npm run preview      # optional: serve the built files locally (port 4173)
```

### 6. Deploy

Upload the contents of the `dist/` folder to any static hosting/CDN (Netlify, Vercel, GitHub Pages, nginx, etc.).

### 7. Lint & Format

```bash
npm run lint         # ESLint
# npm run format     # add if you create a prettier script
```

