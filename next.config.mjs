// GitHub Pages serves this repo at /web-portfolio/, not the domain root, so
// every route/asset needs that prefix - but only when actually building on
// GitHub Actions (GITHUB_ACTIONS is set automatically by the runner).
// Local `next dev`/`next build` stay prefix-free so development isn't
// stuck navigating under a fake subpath.
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubActions ? "/web-portfolio" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages only serves static files - no Node server for
  // next/image's optimization API or SSR, so this ships a fully static
  // `out/` directory instead.
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // next/image and next/link pick up basePath automatically, but raw
  // asset paths (useGLTF's GLB loads, which just do a plain fetch) don't -
  // this exposes it to client code so those can prefix themselves.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
