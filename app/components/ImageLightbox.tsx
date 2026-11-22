"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ImageLightboxProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
};

type ImageStatus = "loading" | "loaded" | "error";

function StatefulImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const [status, setStatus] = useState<ImageStatus>("loading");
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setStatus("loading");
    // A cached image may finish before React attaches onLoad/onError.
    const image = imageRef.current;
    if (image?.complete) {
      setStatus(image.naturalWidth > 0 ? "loaded" : "error");
    }
  }, [src]);

  return (
    <span
      className="image-frame"
      // Reserve the image's box when it fails, since the <img> is then hidden.
      style={
        status === "error"
          ? { aspectRatio: `${width} / ${height}`, width: `min(100%, ${width}px)` }
          : undefined
      }
    >
      {status === "loading" ? <span className="image-skeleton" aria-hidden="true" /> : null}
      {status === "error" ? (
        <span className="image-error" role="img" aria-label={`Image unavailable: ${alt}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="image-error-icon"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
            <path d="M3 3l18 18" />
          </svg>
          <span>Image unavailable</span>
        </span>
      ) : null}
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={[className, status === "error" ? "image-failed" : ""].filter(Boolean).join(" ")}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </span>
  );
}

/**
 * A click-to-enlarge image plus its native modal dialog.
 *
 * `showModal()` supplies the top layer, focus containment, focus return and
 * Esc dismissal. `closedby="any"` adds light dismiss where supported; the
 * effect below covers browsers (notably Safari) that lack it.
 */
export function ImageLightbox({ src, alt, width, height, caption, priority }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    const isOutside = (event: PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    const onPointerDown = (event: PointerEvent) => {
      pressedOutside = isOutside(event);
    };
    // Require both press and release outside so a selection drag that ends on
    // the backdrop does not dismiss the dialog.
    const onPointerUp = (event: PointerEvent) => {
      if (pressedOutside && isOutside(event)) dialog.close();
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", onPointerDown);
    dialog.addEventListener("pointerup", onPointerUp);
    return () => {
      dialog.removeEventListener("pointerdown", onPointerDown);
      dialog.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const label = caption && caption !== alt ? `${alt} — ${caption}` : alt;

  return (
    <>
      <button
        type="button"
        className="figure-zoom-trigger"
        aria-label={`View full size: ${alt}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        <StatefulImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="figure-image"
          sizes="(min-width: 768px) 65ch, 100vw"
        />
      </button>

      <dialog
        ref={dialogRef}
        className="image-lightbox"
        aria-label={label}
        {...({ closedby: "any" } as Record<string, string>)}
      >
        <form method="dialog" className="lightbox-inner">
          <div className="lightbox-stage">
            <StatefulImage
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="lightbox-image"
              sizes="100vw"
            />
          </div>
          <div className="lightbox-bar">
            <p className="lightbox-caption">{caption ?? alt}</p>
            <button
              type="submit"
              className="lightbox-close"
              {...({ autofocus: "" } as Record<string, string>)}
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
