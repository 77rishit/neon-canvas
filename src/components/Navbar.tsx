import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useSpring,
} from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";

const links = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // The glass shell fades in on the first scroll, then keeps thinning out so the
  // bar reads as an ever lighter HUD the deeper you travel.
  const shellOpacity = useSpring(useTransform(scrollY, [0, 120, 900], [0, 1, 0.42]), {
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

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <motion.nav
        animate={{
          maxWidth: scrolled ? 900 : 1180,
          paddingTop: scrolled ? 10 : 18,
          paddingBottom: scrolled ? 10 : 18,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 26 }}
        className="relative mx-auto flex items-center justify-between rounded-2xl border border-transparent px-5"
      >
        <motion.span
          aria-hidden
          style={{ opacity: shellOpacity }}
          className="glass-panel shadow-glow pointer-events-none absolute inset-0 -z-10 rounded-2xl"
        />
        <Link to="/" aria-label="NEOGRID home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <a
                href={link.href}
                className="relative font-display text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button size="sm" variant="outline">
            Enter Grid
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 grid min-h-11 min-w-11 place-items-center rounded-md text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
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
            className="glass-panel mx-auto mt-3 overflow-hidden rounded-2xl md:hidden"
          >
            <ul className="flex flex-col gap-1 p-5">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-sm uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <Button size="sm" className="w-full" onClick={() => setOpen(false)}>
                  Enter Grid
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
