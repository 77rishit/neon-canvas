import { useEffect, useState } from "react";

interface Options {
  /** ms per character while typing */
  typeSpeed?: number;
  /** ms per character while deleting */
  deleteSpeed?: number;
  /** ms to hold a completed word */
  holdTime?: number;
  loop?: boolean;
}

/**
 * Cycles through phrases with a typewriter effect.
 */
export function useTypingText(
  words: string[],
  { typeSpeed = 65, deleteSpeed = 32, holdTime = 1600, loop = true }: Options = {},
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[index % words.length] ?? "";

    if (!deleting && text === current) {
      if (!loop && index === words.length - 1) return;
      const hold = window.setTimeout(() => setDeleting(true), holdTime);
      return () => window.clearTimeout(hold);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
        );
      },
      deleting ? deleteSpeed : typeSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, holdTime, loop]);

  return text;
}

export default useTypingText;
