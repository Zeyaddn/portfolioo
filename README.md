# Zeyad Elassad — Portfolio

Personal portfolio site for **Zeyad Elassad**, Full Stack Developer from Mansoura, Egypt.

**Live:** https://zeyaddn.github.io/portfolioo/

## Sections
- Hero + Navigation
- Marquee + About
- Stack (Frontend, Backend, Data, Quality)
- Services (4 services)
- Projects (7 projects with case-study pages)
- Education
- Contact: email, GitHub, LinkedIn, CV download

## Files
```
index.html            Homepage
404.html              Custom not-found page
projects/             7 case-study pages
css/                  bootstrap.min.css + custom.css
dist/output.css       Built Tailwind utilities
js/                   bootstrap bundle + main.js + theme scripts
assets/img/           Images (WebP)
assets/Zeyad_Elassad_CV.pdf
favicon.ico           Site icon
assets/favicon.*      SVG / PNG / apple-touch icons
robots.txt, sitemap.xml, .nojekyll
```

## Local dev
Serve over a local server (ES modules do not run from `file://`):
```
python -m http.server 8000
```

Rebuild Tailwind after adding new utility classes:
```
npm run build:css
```

## Deploy
Hosted on **GitHub Pages** (branch `main`, root folder). Enable under
Settings → Pages → Branch: `main` / `/ (root)`.
The `.nojekyll` file disables Jekyll processing.

## Contact
zeyadkassem83@gmail.com
