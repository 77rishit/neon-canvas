import { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useSpring,
} from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection, scrollToTop } from "@/utils/scroll";

export const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Events", id: "events" },
  { label: "Competitions", id: "competitions" },
  { label: "Sponsors", id: "sponsors" },
  { label: "Gallery", id: "gallery" },
  { label: "Team", id: "team" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  const ids = useMemo(() => NAV_LINKS.map((l) => l.id), []);
  const active = useActiveSection(ids);

  // The glass shell fades in on the first scroll, then thins out again so the
  // bar reads as an ever lighter HUD the deeper you travel.
  const shellOpacity = useSpring(useTransform(scrollY, [0, 120, 1400], [0, 1, 0.5]), {
    stiffness: 120,
    damping: 26,
  });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    if (id === "home") scrollToTop();
    else scrollToSection(`#${id}`);
  };

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <motion.nav
        aria-label="Primary"
        animate={{
          maxWidth: scrolled ? 1160 : 1280,
          paddingTop: scrolled ? 10 : 16,
          paddingBottom: scrolled ? 10 : 16,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 26 }}
        className="relative mx-auto flex items-center justify-between gap-4 rounded-2xl border border-transparent px-5"
      >
        <motion.span
          aria-hidden
          style={{ opacity: shellOpacity }}
          className="glass-panel shadow-glow pointer-events-none absolute inset-0 -z-10 rounded-2xl"
        />
        <button
          type="button"
          onClick={() => go("home")}
          aria-label="NEO//GRID Techfest, back to top"
          className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </button>

        <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV_LINKS.map((link, i) => {
            const isActive = active === link.id;
            return (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.id);
                  }}
                  className={`relative font-display text-[0.62rem] uppercase tracking-[0.24em] transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-primary shadow-[0_0_10px_var(--primary)]"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                </a>
              </motion.li>
            );
          })}
        </ul>

        <div className="hidden shrink-0 lg:block">
          <Button size="sm" onClick={() => scrollToSection("#registration")}>
            Register
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 grid min-h-11 min-w-11 place-items-center rounded-md text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {open ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-panel mx-auto mt-3 max-h-[74dvh] overflow-y-auto rounded-2xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 p-5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.id);
                    }}
                    className={`block py-3 font-display text-sm uppercase tracking-[0.22em] transition-colors ${
                      active === link.id ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    scrollToSection("#registration");
                  }}
                >
                  Register Now
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
