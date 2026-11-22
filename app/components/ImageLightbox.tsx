"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type ImageLightboxProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
};

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
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 768px) 65ch, 100vw"
          className="figure-image"
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
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="100vw"
              className="lightbox-image"
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
