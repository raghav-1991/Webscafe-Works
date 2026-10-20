# Stag — React Portfolio

The **Stag Personal Portfolio** HTML template rebuilt as a React 18 + Vite app.
It keeps the original layout, design, content and assets, and adds modern motion and interaction effects
adapted from community components on [21st.dev](https://21st.dev).

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build
```

Requires Node 18+.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: hero + globe, project slider, partners, timeline, services, stack, blog, testimonials, gallery, contact |
| `/projects` | Project grid with an animated category filter |
| `/projects/:slug` | Project case study |
| `/about` | About: hero with resume + X post, timeline, partners, services, photos, stack, newsletter |
| `/gallery` | 24-image grid with a lightbox (keyboard, swipe, morph-from-thumbnail) |
| `/contact` | Newsletter, stats, contact form + address |
| `/blog` | Article grid |
| `/blog/:slug` | Article |
| `*` | 404 |

## Folder structure

```
src/
├── main.jsx                 # entry: router + global styles
├── App.jsx                  # MotionConfig (respects prefers-reduced-motion)
├── routes/AppRoutes.jsx     # lazy-loaded routes + animated page transitions
├── pages/                   # one file per route (composition only)
├── components/
│   ├── layout/              # MainLayout, Sidebar, Footer, PageWrapper
│   ├── sections/            # page sections (HeroHome, ProjectSlider, Services, ContactSection, …)
│   ├── cards/               # ProjectCard, BlogCard, ServiceCard, StatCard, TimelineItem, …
│   ├── ui/                  # ThemeButton, SectionHeader, Subtitle, AnimatedText, SliderNav, Lightbox, …
│   └── effects/             # visual effects (see below)
├── data/                    # ALL content: profile, projects, blog, resume, gallery
├── hooks/                   # useClock, useSpotlight, useMagnetic, useFormSubmit, useMediaQuery, …
├── utils/                   # asset path helper, className joiner
└── styles/
    ├── index.css            # import order = cascade order
    ├── base/                # fonts, tokens/reset/buttons, page shell
    ├── sections/            # original template CSS, split into one file per section
    ├── responsive.css       # original breakpoints (1439 / 1181 / 855 / 809 / 600)
    ├── vendor/icons.css     # generated icon subset (npm run icons)
    └── effects/             # effects.css (new components) + enhancements.css (hovers, new UI)
public/assets/imgs/          # every image from the template, unchanged
scripts/build-icon-subset.mjs
```

**To edit content**, change the files in `src/data/`. Components never hard-code copy.

## What was converted

| Template (jQuery / vendor) | React version |
| --- | --- |
| Swiper 4 sliders (`main.js`) | `swiper/react` 11 with ref-based navigation, keyboard and a11y; testimonial autoplay |
| `moment.js` date/time, printed once | `useClock` hook; the clock and date update live |
| Hamburger `classList.toggle` | Sidebar state; closes automatically on navigation |
| cobe globe from skypack `<script type=module>` | `<Globe/>` from npm: HiDPI, drag to spin with momentum, pauses off-screen |
| CSS marquees with hard-coded distances (`-680px`, `-989px`, `998px`) that jumped at the loop point | Seamless `<Marquee/>` (two tracks, `translateX(-100%)`) |
| jQuery AJAX → PHP mailers | `useFormSubmit`: validation, loading state, animated status; posts to Web3Forms |
| Full Bootstrap 5.3 | Bootstrap **Reboot** only (the only part the template used) |
| Google Fonts + 2 icon CDNs | Self-hosted DM Sans (variable, opsz) + icon CSS subset to the 37 icons used; CSS went from 618 KB to 88 KB |

## Enhancements and 21st.dev sources

Each component in `components/effects/` notes where it came from. They were rewritten as plain CSS +
framer-motion, so the original stylesheet is untouched and Tailwind isn't needed.

| Effect | Inspired by (21st.dev) | Where |
| --- | --- | --- |
| Particles background | Magic UI **Particles** | Whole site (reacts to the pointer) |
| Scroll progress bar | Magic UI **Scroll Progress** | Top of the viewport |
| Blur-fade on scroll + staggered lists | Magic UI **Blur Fade**, Motion Primitives **In View** | Every section and card list |
| Number ticker | Magic UI **Number Ticker** | 12+ / 100+ / $16M stats |
| Card spotlight | Magic UI **Magic Card**, Aceternity **Card Spotlight** | Project, blog, service, stack, stat and testimonial cards |
| Border beam | Magic UI **Border Beam** | Hero intro card, 404 |
| Marquee | Magic UI **Marquee** | Section ribbons, partner logos, gallery strip (pause on hover) |
| Globe | Magic UI **Globe** (cobe) | Home hero |
| Text shimmer | Motion Primitives **Text Shimmer** | "A WEB DEVELOPER" kicker |
| Word blur-in | Motion Primitives **Text Effect** | Hero and detail headings |
| Magnetic buttons | Motion Primitives **Magnetic** | All "rolling label" buttons |
| Morphing lightbox | Motion Primitives **Morphing Dialog** | Gallery page |
| 3D tilt with glare | Tilt-card components | Hero portraits, About photos |
| Cursor light | Aceternity **Spotlight** | Desktop only |

Other changes:
- Page transitions between routes.
- A sidebar highlight that slides between menu items.
- An animated, filterable project grid.
- A signature "draw-on" effect and a waving hand in the hero.
- Image zoom and icon micro-interactions on hover.
- Focus rings, `aria` labels, and real `<button>`s instead of clickable `<div>`s.

All motion respects `prefers-reduced-motion`.

## Contact & newsletter forms

Copy `.env.example` to `.env` and set `VITE_WEB3FORMS_KEY` (free key from [web3forms.com](https://web3forms.com)).
Without a key, the forms validate and show a simulated success message, so the site can be demoed without a backend.

## Deployment

The output is a static SPA in `dist/`. For client-side routes, configure your host's SPA fallback:
- **Netlify:** add `/* /index.html 200` to `public/_redirects`.
- **Vercel:** add a rewrite to `/index.html`.

For a sub-path deploy, set `base` in `vite.config.js`. Image paths go through `utils/asset.js`, so they follow it.

## Notes

- The images are the template's own placeholder graphics (e.g. "601 × 512"). Swap the files in `public/assets/imgs/` and keep the names.
- After using a new Phosphor (`ph-*`) or Line Awesome (`la-*`) icon, run `npm run icons`. `npm run build` does this automatically.
