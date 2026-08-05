/**
 * Dependency-free SplitText replacement.
 *
 * Splits an element's text into word spans, measures where the browser wrapped
 * them, then re-wraps each visual line in an `overflow:hidden` block so the
 * inner line can be masked/translated like GSAP's Club SplitText plugin.
 *
 * Only plain-text elements are split; anything containing markup is left alone
 * so we never destroy nested React-rendered nodes.
 */
export interface SplitResult {
  /** Inner (movable) element of every measured visual line. */
  lines: HTMLElement[];
  /** Every word span, in document order. */
  words: HTMLElement[];
  /** Restores the original markup. */
  revert: () => void;
}

export function splitText(el: HTMLElement): SplitResult | null {
  const text = el.textContent?.replace(/\s+/g, " ").trim();
  if (!text) return null;
  // Refuse to flatten rich content (icons, spans, links).
  if (el.children.length > 0) return null;

  const original = el.innerHTML;

  const makeWord = (value: string) => {
    const span = document.createElement("span");
    span.className = "split-word";
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    span.textContent = value;
    return span;
  };

  // Pass 1 — lay the words out so the browser tells us where lines break.
  el.textContent = "";
  const words = text.split(" ").map(makeWord);
  words.forEach((word, i) => {
    el.appendChild(word);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });

  const rows = new Map<number, HTMLElement[]>();
  for (const word of words) {
    const top = Math.round(word.offsetTop);
    const bucket = rows.get(top);
    if (bucket) bucket.push(word);
    else rows.set(top, [word]);
  }

  // Pass 2 — rebuild as masked lines.
  el.textContent = "";
  const lines: HTMLElement[] = [];
  [...rows.entries()]
    .sort((a, b) => a[0] - b[0])
    .forEach(([, rowWords]) => {
      const mask = document.createElement("span");
      mask.className = "split-line";
      mask.style.display = "block";
      mask.style.overflow = "hidden";
      mask.style.paddingBottom = "0.08em";

      const inner = document.createElement("span");
      inner.className = "split-line-inner";
      inner.style.display = "block";
      inner.style.willChange = "transform, opacity";

      rowWords.forEach((word, i) => {
        inner.appendChild(word);
        if (i < rowWords.length - 1) inner.appendChild(document.createTextNode(" "));
      });

      mask.appendChild(inner);
      el.appendChild(mask);
      lines.push(inner);
    });

  return {
    lines,
    words,
    revert() {
      el.innerHTML = original;
    },
  };
}

export default splitText;
