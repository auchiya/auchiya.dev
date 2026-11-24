import { ImageLightbox } from "./ImageLightbox";

export type FigureProps = {
  /** Image URL, e.g. an imported asset's `src` or a `/images/...` public path. */
  src: string;
  /** Required for accessibility. Describe what is in the image. */
  alt: string;
  /** Intrinsic pixel dimensions, used to reserve space and avoid layout shift. */
  width: number;
  height: number;
  /** Optional visible caption shown below the image. */
  caption?: string;
  /** Use for the first, above-the-fold image on a page only. */
  priority?: boolean;
  className?: string;
};

/**
 * An optimized image with an optional caption. Clicking the image opens a
 * full-size lightbox. See docs/images.md for usage in pages and MDX content.
 */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
  className = "",
}: FigureProps) {
  return (
    <figure className={["figure", className].filter(Boolean).join(" ")}>
      <ImageLightbox
        src={src}
        alt={alt}
        width={width}
        height={height}
        caption={caption}
        priority={priority}
      />
      {caption ? <figcaption className="figure-caption">{caption}</figcaption> : null}
    </figure>
  );
}
