import { useEffect, useState } from "react";

/**
 * Scroll spy. Returns the id of the section currently closest to the top of the
 * viewport (accounting for the fixed navbar), for nav link highlighting.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const read = () => {
      const offset = 140;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom, always highlight the last reachable section.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        const last = ids.filter((id) => document.getElementById(id)).pop();
        if (last) current = last;
      }
      setActive(current);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [ids]);

  return active;
}

export default useActiveSection;
