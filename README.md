# Zeyad Elassad — Awwwards-Caliber Portfolio Website

An editorial, dark-first personal portfolio site built for **Zeyad Elassad** (Lead Creative Developer & Art Director). Engineered with pure vanilla JavaScript ES modules, Three.js, GSAP ScrollTrigger, Bootstrap 5.3, and Tailwind CSS 3.4 (`tw-` prefixed). Designed to pass 95+ on Google Lighthouse across Performance, Accessibility, Best Practices, and SEO.

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Build or Watch Tailwind CSS
Tailwind generates a minified, purged stylesheet in `dist/output.css` with zero preflight conflicts:
```bash
# Watch mode during development:
npm run watch:css

# One-off production build:
npm run build
```

### 3. Local Preview Server
You can serve the folder using any static server:
```bash
npx serve .
# or Python
python -m http.server 8080
```

---

## 📸 Image Optimization CLI Commands

To generate responsive `AVIF` and `WebP` variants from your source hero photo:

### Using `sharp-cli` (Recommended):
```bash
# Install sharp-cli globally or locally
npm i -g sharp-cli

# Generate WebP (1254px)
sharp -i ./assets/img/hero.jpg -o ./assets/img/hero.webp -w 1254 -q 85

# Generate AVIF (1254px)
sharp -i ./assets/img/hero.jpg -o ./assets/img/hero.avif -w 1254 -q 80
```

### Using `cwebp` & `avifenc`:
```bash
# WebP
cwebp -q 85 ./assets/img/hero.jpg -o ./assets/img/hero.webp

# AVIF
avifenc -s 4 --min 20 --max 30 ./assets/img/hero.jpg ./assets/img/hero.avif
```

---

## 🎨 Design System & Customization

### Design Tokens (`css/custom.css`):
- `--bg`: `#0A0A0B` (Dark) / `#F5F5F7` (Light)
- `--surface`: `#121214` (Dark) / `#FFFFFF` (Light)
- `--border`: `rgba(255, 255, 255, 0.08)`
- `--text`: `#F4F4F5`
- `--muted`: `#A1A1AA`
- `--accent`: `#C6FF3D` (Volt Lime)
- `--accent-secondary`: `#7928CA` (Electric Violet)

### Typography Stack:
- **Display**: `Syne` 700–800 (clamp: 3.25rem to 8.5rem, -0.04em letter-spacing)
- **Body**: `Manrope` 400–600 (16–18px, 1.65 line-height)
- **Technical Mono**: `JetBrains Mono` 400–500 (12px, 0.12em uppercase tracking)

---

## 📁 Project Structure

```
.
├── index.html               # Semantic HTML5 markup, all 11 sections
├── package.json             # NPM build scripts & dependencies
├── tailwind.config.js       # Configured with tw- prefix & preflight: false
├── _headers                 # Security headers and asset cache rules
├── robots.txt               # SEO crawler directives
├── sitemap.xml              # XML Sitemap
├── src/
│   └── input.css            # Tailwind components & utilities bridge
├── dist/
│   └── output.css           # Minified production purged CSS
├── css/
│   └── custom.css           # Design tokens, keyframes, luxury styling
├── js/
│   ├── main.js              # UI controller, GSAP, case studies modal, theme toggle
│   └── hero-3d.js           # Lazy-loaded Three.js domain-warped noise shader
└── assets/
    └── img/
        ├── hero.png         # Original hero portrait
        ├── hero.jpg         # Hero JPG fallback
        ├── hero.webp        # WebP variant
        └── project-*.svg    # 6 vector project thumbnails (16:9, 4:5, 9:16)
```

---

## 🌐 Deployment Instructions

### 1. Netlify
- Build command: `npm run build`
- Publish directory: `.`
- The `_headers` file will configure caching and CSP headers automatically.

### 2. Vercel
- Framework Preset: `Other`
- Build command: `npm run build`
- Output directory: `.`

### 3. GitHub Pages
- Run `npm run build`
- Push to `main` branch or configure GitHub Actions to deploy static files.

### 4. Cloudflare Pages
- Build command: `npm run build`
- Output directory: `.`

---

## ⚡ Performance & Accessibility Highlights
- **LCP Optimization**: Real `<img>` inside `<picture>` with `fetchpriority="high"`, explicit dimensions (`1254x1254`), no lazy-loading.
- **Three.js Progressive Enhancement**: Defers loading until `requestIdleCallback`, respects `prefers-reduced-motion`, `Save-Data`, and checks hardware cores.
- **Zero CLS**: Strict aspect-ratio and dimension tags on all media.
- **Accessibility**: Skip link, keyboard focus states, WCAG AA color contrast, and semantic landmarks.
