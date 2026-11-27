"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type ImageLightboxProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
};

type ImageStatus = "loading" | "loaded" | "error";

type LightboxImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

const TRIGGER_SELECTOR = "[data-lightbox-trigger]";

/**
 * Collect every figure in the current article, in document order, so each
 * lightbox can act as a carousel over the whole post rather than a single
 * image. The clicked trigger determines the starting image.
 */
function collectImages(trigger: HTMLElement, fallback: LightboxImage) {
  const root = trigger.closest("article") ?? trigger.closest(".prose") ?? document;
  const triggers = Array.from(root.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR));
  const index = Math.max(0, triggers.indexOf(trigger));

  const images = triggers.map((element) => ({
    src: element.dataset.lightboxSrc || fallback.src,
    alt: element.dataset.lightboxAlt ?? fallback.alt,
    width: Number(element.dataset.lightboxWidth) || fallback.width,
    height: Number(element.dataset.lightboxHeight) || fallback.height,
    caption: element.dataset.lightboxCaption || undefined,
  }));

  return { images, index };
}

function StatefulImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
  fitViewport,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  sizes: string;
  priority?: boolean;
  /** Match the lightbox image's viewport height cap while the box is reserved. */
  fitViewport?: boolean;
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

  // Reserve the image's box while loading (and on error, when the <img> is
  // hidden) so the shimmer has real dimensions and nothing jumps on load.
  // The viewport term mirrors `.lightbox-image`'s max-height.
  const placeholderStyle =
    status === "loaded"
      ? undefined
      : {
          aspectRatio: `${width} / ${height}`,
          width: fitViewport
            ? `min(100%, ${width}px, calc((100vh - 9rem) * ${width / height}))`
            : `min(100%, ${width}px)`,
        };

  return (
    <span className="image-frame" style={placeholderStyle}>
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
 * A click-to-enlarge image plus its native modal dialog. Every image in the
 * same article joins the dialog as a carousel: navigate with the on-screen
 * arrows, Left/Right arrow keys, or vim-style h/l keys.
 *
 * `showModal()` supplies the top layer, focus containment, focus return and
 * Esc dismissal. `closedby="any"` adds light dismiss where supported; the
 * effect below covers browsers (notably Safari) that lack it.
 */
export function ImageLightbox({ src, alt, width, height, caption, priority }: ImageLightboxProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [images, setImages] = useState<LightboxImage[]>([{ src, alt, width, height, caption }]);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (images.length < 2) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  const open = () => {
    const trigger = triggerRef.current;
    if (trigger) {
      const collected = collectImages(trigger, { src, alt, width, height, caption });
      setImages(collected.images);
      setIndex(collected.index);
    }
    dialogRef.current?.showModal();
  };

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

  // A modal dialog owns the keyboard while open (global shortcuts already
  // pause), so arrows and vim-style h/l can safely drive the carousel.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (event.key === "ArrowRight" || key === "l") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft" || key === "h") {
        event.preventDefault();
        go(-1);
      }
    };

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [go]);

  const hasMultiple = images.length > 1;
  const current = images[index] ?? images[0];
  const label = hasMultiple
    ? "Image gallery"
    : current.caption && current.caption !== current.alt
      ? `${current.alt} — ${current.caption}`
      : current.alt;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="figure-zoom-trigger"
        data-lightbox-trigger=""
        data-lightbox-src={src}
        data-lightbox-alt={alt}
        data-lightbox-width={width}
        data-lightbox-height={height}
        data-lightbox-caption={caption}
        aria-label={`View full size: ${alt}`}
        onClick={open}
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
          <div
            className={["lightbox-stage", hasMultiple ? "lightbox-stage-gallery" : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {hasMultiple ? (
              <button
                type="button"
                className="lightbox-nav lightbox-nav-prev"
                aria-label="Previous image"
                onClick={() => go(-1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            ) : null}
            <StatefulImage
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="lightbox-image"
              sizes="100vw"
              fitViewport
            />
            {hasMultiple ? (
              <button
                type="button"
                className="lightbox-nav lightbox-nav-next"
                aria-label="Next image"
                onClick={() => go(1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            ) : null}
          </div>
          <div className="lightbox-bar">
            <p className="lightbox-caption">{current.caption ?? current.alt}</p>
            {hasMultiple ? (
              <p className="lightbox-counter" aria-live="polite">
                {index + 1} / {images.length}
              </p>
            ) : null}
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
