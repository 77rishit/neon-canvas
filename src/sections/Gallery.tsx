import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize2 } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GALLERY } from "@/data/fest";

/** Masonry-ish gallery grid with a keyboard-navigable lightbox. */
export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % GALLERY.length)),
    [],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length)),
    [],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [index, close, next, prev]);

  const current = index === null ? null : GALLERY[index];

  return (
    <Section
      id="gallery"
      eyebrow="Gallery"
      title="Last edition, in frames"
      description="Twelve thousand participants, three stages and seventy-two hours of continuous build time. Click any frame to open the lightbox."
    >
      <div
        className="grid auto-rows-[minmax(0,1fr)] grid-flow-dense grid-cols-2 gap-4 [grid-auto-rows:14rem] md:grid-cols-3 md:[grid-auto-rows:16rem]"
        data-fx="stagger"
      >
        {GALLERY.map((img, i) => (
          <button
            key={`${img.alt}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open image: ${img.alt}`}
            className={`group relative overflow-hidden rounded-2xl border border-border/70 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >

            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              width={1280}
              height={853}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-30" />
            <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-lg border border-primary/40 bg-background/70 text-primary opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <FiMaximize2 size={15} />
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            <motion.figure
              key={index}
              role="dialog"
              aria-modal="true"
              aria-label={current.alt}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="relative z-10 w-full max-w-4xl"
            >
              <img
                src={current.src}
                alt={current.alt}
                width={1280}
                height={853}
                className="max-h-[74dvh] w-full rounded-2xl border border-primary/25 object-contain shadow-[0_0_80px_-30px_var(--primary)]"
              />
              <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                {current.alt}{" "}
                <span className="ml-2 font-display text-[0.55rem] uppercase tracking-[0.28em] text-primary">
                  {(index ?? 0) + 1} / {GALLERY.length}
                </span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute right-4 top-4 z-20 grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background/70 text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FiX size={22} />
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 z-20 grid min-h-12 min-w-12 place-items-center rounded-xl border border-border bg-background/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 z-20 grid min-h-12 min-w-12 place-items-center rounded-xl border border-border bg-background/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}

export default Gallery;
