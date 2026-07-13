# UrbanFlow — Marketing Landing Page

A clean, modern, and responsive marketing site for **UrbanFlow**, a multimodal
mobility assistant. Built with React + Vite using plain CSS (no UI framework).

## Features

- **Hero** with brand name, tagline, pitch, and primary CTAs
- **Features** grid (8 key features) sourced from the UrbanFlow README
- **Screenshots** section with styled gradient placeholders
- **Download / CTA** section with App Store, Google Play, and GitHub links
- **Footer** with copyright and navigation links
- Fully responsive (mobile-first CSS grid)
- Green/steel-blue brand palette (`#3CB371`, `#4682B4`)

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Build & Preview

```bash
npm run build
npm run preview
```

## Project Structure

```
landing/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json          # SPA rewrite config for Vercel
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── index.css
└── README.md
```

## Deployment

### Vercel

This project includes `vercel.json` with an SPA rewrite so all routes resolve to
`index.html`. Import the `landing/` folder into Vercel (or run `vercel` inside
it) — the framework preset is **Vite**, build command `npm run build`, output
directory `dist`.

### Netlify (alternative)

If you prefer Netlify, add a `netlify.toml` at the root of `landing/`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Notes

- App Store and Google Play links are placeholders (`#`) marked "coming soon".
- Update `GITHUB_URL` in `src/App.jsx` with the real repository URL.
- No `npm install` is required to review the source; dependencies are declared
  in `package.json`.
