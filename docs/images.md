# Adding images

Content images live next to their MDX in `content/<section>/images/`. They are
imported at build time, so the emitted file gets a content hash and an immutable
URL. Project pages display screenshots with the shared `Figure` component.

Clicking a `Figure` image opens a full-size lightbox (a native `<dialog>`). It
closes with Esc, the Close button, or a click outside the image. Keyboard
shortcuts are paused while it is open. A skeleton fills the image's space while
it loads; a failed load shows an "Image unavailable" placeholder instead of a
broken image.

Every `Figure` in the same `<article>` joins the lightbox as a carousel, in
document order. The clicked image appears first; move between images with the
on-screen arrows, the Left/Right arrow keys, or vim-style `h`/`l`, and follow
along with the `n / N` counter. Articles with a single image keep the original
single-image view.

## Where files go

```
content/
├── projects/
│   ├── images/        # project screenshots
│   └── image-map.ts   # imports + dimensions for project screenshots
└── misc/
    └── images/        # misc / coffee photos

public/                # only fixed-URL files: favicon, manifest, og-image
```

Imported files are not served at `/images/...`. The build emits them under
`/_next/static/media/` with a content hash, for example
`/_next/static/media/auchiya.dev.c12f124c.webp`. Replacing the file changes the
hash and the URL, so browser and CDN caches are busted automatically.

Keep `public/` for files whose URL must stay stable: favicons, the web manifest,
and `og-image.webp` (referenced from `app/layout.tsx`).

## Project screenshots

1. Put the file in `content/projects/images/`.
2. Add an import and an entry in `content/projects/image-map.ts`.
3. Reference it from the project's `meta.screenshots`:

```mdx
import { projectImages } from "./image-map";

export const meta = {
  title: "My project",
  year: "2026",
  summary: "...",
  stack: ["react"],
  screenshots: [
    {
      ...projectImages["my-project-dashboard"],
      alt: "Dashboard showing the main analytics view",
      caption: "The dashboard's main view.",
    },
  ],
};
```

The imported asset provides `src`, `width`, and `height`, so you do not need to
look up dimensions for project screenshots. Use the file name (without the
extension) as the map key, and remove the entry when you delete an image.

The fields are defined by `ProjectImage` in `content/projects/types.ts`.

## Inline images in MDX (coffee photos, etc.)

Image imports inside `.mdx` resolve to a URL string, not to
`{ src, width, height }`. Import the file and pass it directly, keeping the
intrinsic dimensions in the `Figure` props:

```jsx
import { Figure } from "@/app/components/Figure";
import photo from "./images/filter-coffee-brew.webp";

export const meta = { /* ... */ };

## Brewing

<Figure
  src={photo}
  alt="Coffee blooming in a Melitta filter holder"
  width={1200}
  height={900}
  caption="The bloom, 30 seconds in."
/>
```

Get the dimensions on macOS:

```sh
sips -g pixelWidth -g pixelHeight content/misc/images/filter-coffee-brew.webp
```

If you want automatic dimensions for a set of inline images, put them in a
`.ts` map like `content/projects/image-map.ts` and reference the entries from
MDX.

Only use `priority` for the first, above-the-fold image on a page; all other
images load lazily.

Plain Markdown images (`![alt](/images/misc/photo.png)`) still render if the
file is in `public/`, but they are unoptimized and have no reserved size or
caption. Use `Figure` for a consistent result.

## How caching works

- Imported images are emitted as
  `/_next/static/media/<name>.<hash>.<ext>` and served with
  `Cache-Control: public, max-age=31536000, immutable`.
- `next/image` requests them through `/_next/image?url=...`, which is also
  immutable. Because the source URL contains the content hash, updating the
  file changes both URLs.
- `public/` files keep stable URLs and are revalidated (`max-age=0`). Use them
  only when the URL must not change.

## Metadata / privacy

The optimizer strips metadata from _resized_ variants, but the original imported
file is still served directly at its hashed `/_next/static/media/...` URL. GPS
coordinates, camera serials, timestamps, and author fields would therefore be
public. Two scripts keep that from happening:

```sh
vp run check:images              # fail on sensitive metadata
vp run strip:images              # re-encode + strip, then verify
vp run strip:images -- --dry-run # preview without writing
```

`strip:images` removes all EXIF, IPTC, and XMP data, then writes only the owner
fields (`Artist`, `Copyright`, `CameraOwnerName`) as `auchiya.dev`. The check
accepts exactly those values and rejects GPS tags, serial numbers, timestamps,
author/contact fields, and any remaining IPTC or XMP blocks. Both scripts scan
`content/` and `public/images/` by default, and accept explicit file paths:

```sh
vpx ./scripts/check-images.mts content/misc/images/filter-coffee-brew.webp
```

The `staged` block in `vite.config.ts` runs `check:images` for image files on
commit. The deploy workflow also runs `vp run check:images` on every push and PR,
before the build/deploy steps, so a leak blocks both preview and production
deployments.

Run `strip:images` once after adding new photos, then commit the cleaned files.

## Configuration notes

- `next.config.ts` keeps `/images/**` for public images. Vinext automatically
  allows `/_next/static/media/**` for imported images, so no per-image config is
  needed.
- `images.unoptimized` is enabled only in development. In dev, vinext points
  imported images at their Vite source path (`/content/...`), which the
  Cloudflare Worker image endpoint cannot fetch. Serving those files directly
  avoids 400s; production still uses `/_next/image` and the content-hashed URLs.
- `content/projects/image-map.ts` is a `.ts` module on purpose: vinext's image
  import transform returns `{ src, width, height }` for `.ts`/`.tsx` imports.
  Direct `.mdx` image imports only return the URL string.
- The Cloudflare optimizer binding is configured in `vite.config.ts` and
  `cloudflare.config.ts`; no per-image setup is needed.
- Figure styling (border, caption, theme colors) lives in `app/globals.css`.
