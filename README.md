# Ain e Muhammad — Portfolio

Built with Next.js, Tailwind CSS v4, React Three Fiber, and Framer Motion.

## Concept

"The Reconstruction" — the hero shows small shards flying together into a
low-poly form, echoing the 2D→3D generative pipelines you build professionally.
Everything below the hero is clean, fast, content-first 2D — quick to read,
accessible, good Lighthouse scores.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000. (This requires normal internet access — the
Google Fonts used in `app/layout.js` are fetched and self-hosted automatically
at build time by Next.js.)

## Structure

- `app/layout.js` — fonts, metadata, no-flash theme boot script
- `app/globals.css` — design tokens (colors for light/dark, in CSS variables)
- `components/Hero.js` + `components/HeroScene.js` — the 3D hero
- `components/sections/*` — Expertise, Experience, Projects, Skills, Education, Contact
- `components/ThemeToggle.js` — light/dark switch (persists via localStorage)

## Swapping in your real 3D asset (Meshy / Tripo 3D)

Right now the hero is procedural (an icosahedron broken into instanced shards,
animated in Three.js) — no external model needed, loads instantly. When your
Meshy or Tripo 3D "reconstruction" asset is ready:

1. Export it as `.glb` (Draco-compressed if possible) and drop it in `public/models/`.
2. In `components/HeroScene.js`, replace the `Shards` component with a
   `useGLTF('/models/your-file.glb')` call from `@react-three/drei`, and reuse
   the existing shard fly-in animation logic (interpolating each mesh from a
   scattered `start` position to its real position) for the assembly effect.
3. Keep the `accent` prop wired to `--shard` so the asset's rim-light /
   emissive tint still respects light/dark mode.

## Design tokens

Colors, type, and the light/dark pairing live in `app/globals.css` as CSS
variables (`--bg`, `--surface`, `--accent`, etc.) — change the palette in one
place. Typography: **Space Grotesk** (display), **Inter** (body), **JetBrains
Mono** (labels/dates/tags).

## Deploy

Push to GitHub and import into Vercel — zero config needed for this stack.
