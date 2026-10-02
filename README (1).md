# Nash Alino — Portfolio

Plain HTML, CSS and JavaScript. No build step. GSAP, ScrollTrigger, Lenis and Google Fonts load from CDNs.

```
portfolio-site/
├── index.html          all page content (hero, chapters, contact)
├── css/style.css       all styling — colours & fonts at the top in :root
├── js/projects.js      your projects (drives the carousel + case study pages)
├── js/main.js          animations, carousel, cursor, routing
└── assets/images/      put your images here
```

## 1. Put it in your repo
1. Copy everything inside `portfolio-site/` into the root of your repo (so `index.html` sits at the top level).
2. Commit and push:
   ```
   git add .
   git commit -m "Add portfolio site"
   git push
   ```

## 2. Preview locally
Double-clicking `index.html` works, but a local server is closer to the real thing:
- VS Code: install the **Live Server** extension → right-click `index.html` → *Open with Live Server*
- or in a terminal in the folder: `npx serve` (or `python3 -m http.server`) and open the URL it prints.

## 3. Publish (pick one)
- **GitHub Pages:** repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `root` → Save. Live in ~1 minute at `https://<username>.github.io/<repo>/`.
- **Netlify / Vercel:** import the repo, leave build command empty, publish directory = root.

## 4. Edit your content
| What | Where |
|---|---|
| Colours | `css/style.css` → `:root` at the top (`--bg`, `--text`, `--accent`…) |
| Fonts | Google Fonts `<link>` in `index.html` + `--display` / `--body` in `:root` |
| Hero, bio, quote, services, experience | `index.html` (search for `[` to find every placeholder) |
| Projects + case studies | `js/projects.js` |
| Email | `index.html` → `mailto:` link in the Contact section |
| Social links | `index.html` → replace `#LINKEDIN_URL`, `#INSTAGRAM_URL`, `#BEHANCE_URL` (3 places each) |
| Loader / custom cursor on/off | `js/main.js` → `SETTINGS` at the top |

## 5. Add images
1. Drop files into `assets/images/` (JPG/WebP, ~2000px wide max, compressed).
2. **Projects:** in `js/projects.js` set `cover`, `hero` and `gallery`, e.g.
   ```js
   cover: 'assets/images/typewriter-cover.jpg',
   hero: 'assets/images/typewriter-hero.jpg',
   gallery: ['assets/images/typewriter-1.jpg', 'assets/images/typewriter-2.jpg'],
   ```
3. **Hero, portrait, services:** in `index.html`, replace the `<span class="mono ph__label">…</span>` inside the grey box with an image:
   ```html
   <img src="assets/images/portrait.jpg" alt="Nash Alino">
   ```
   For a video in the hero: `<video src="assets/images/reel.mp4" autoplay muted loop playsinline></video>`

## Adding a project
Copy one block in `js/projects.js`, give it a new unique `id`, and set `tag` to `Web`, `Branding` or `Print` (or add a new filter button in `index.html` with a matching `data-filter`).

## Placeholders still to fill
- Pull quote, location and availability (`index.html`)
- Project years, roles, clients, descriptions and images (`js/projects.js`)
- Featured visual, portrait and service images
- Social links
