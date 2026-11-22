# Adding images

Images live in `public/images/`, are served through the Cloudflare image
optimizer via `next/image`, and are displayed with the shared `Figure`
component. This keeps them responsive and avoids layout shift.

## Where files go

```
public/images/
├── projects/   # screenshots for project pages
└── misc/       # photos for misc / coffee posts
```

Files are public at `/images/<folder>/<file>`, e.g.
`/images/projects/solar-calculator-dashboard.png`.

Use lowercase, kebab-case names that describe the content plus the slug of the
entry they belong to, for example `filter-coffee-brew.png`. Prefer `.webp`
or `.jpg` for photos, `.png` for UI screenshots. SVG files are served as-is
(the optimizer skips them).

## Getting the dimensions

`Figure` needs the intrinsic pixel dimensions so the browser can reserve the
right amount of space. On macOS:

```sh
sips -g pixelWidth -g pixelHeight public/images/projects/example.png
```

## Project screenshots

Add a `screenshots` array to the project's `meta` export in
`content/projects/<slug>.mdx`. The project page renders a **Screenshots**
section from it automatically:

```jsx
export const meta = {
  title: "My project",
  year: "2026",
  summary: "...",
  stack: ["react"],
  screenshots: [
    {
      src: "/images/projects/my-project-dashboard.png",
      alt: "Dashboard showing the main analytics view",
      width: 1440,
      height: 900,
      caption: "The dashboard's main view.",
    },
  ],
};
```

The fields are defined by `ProjectImage` in `content/projects/types.ts`.

## Inline images in MDX (coffee photos, etc.)

Import `Figure` at the top of an MDX file and use it where the image belongs:

```jsx
import { Figure } from "@/app/components/Figure";

export const meta = { /* ... */ };

## Brewing

<Figure
  src="/images/misc/filter-coffee-brew.png"
  alt="Coffee blooming in a Melitta filter holder"
  width={1200}
  height={900}
  caption="The bloom, 30 seconds in."
/>
```

Only use `priority` for the first, above-the-fold image on a page; all other
images load lazily.

Plain Markdown images (`![alt](/images/misc/photo.png)`) still render, but they
are unoptimized and have no reserved size or caption. Use `Figure` for a
consistent result.

## Configuration notes

- `next.config.ts` restricts the image optimizer to `/images/**`, so keep
  optimized images inside that directory.
- The Cloudflare optimizer binding is configured in `vite.config.ts` and
  `cloudflare.config.ts`; no per-image setup is needed.
- Figure styling (border, caption, theme colors) lives in `app/globals.css`.
