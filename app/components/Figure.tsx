import Image from "next/image";

export type FigureProps = {
  /** Public URL of the image, e.g. `/images/projects/solar-calculator.png`. */
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
 * An optimized image with an optional caption.
 *
 * Local images are served through the configured Cloudflare image optimizer,
 * so provide the original pixel dimensions via `width`/`height`. See
 * docs/images.md for usage in pages and MDX content.
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
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(min-width: 768px) 65ch, 100vw"
        className="figure-image"
      />
      {caption ? <figcaption className="figure-caption">{caption}</figcaption> : null}
    </figure>
  );
}
