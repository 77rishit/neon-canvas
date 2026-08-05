import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUp, FiCheck } from "react-icons/fi";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { SOCIALS } from "@/sections/Contact";
import { NAV_LINKS } from "@/components/Navbar";
import { scrollToSection, scrollToTop } from "@/utils/scroll";
import { FEST } from "@/data/fest";

const MARQUEE = ["Hackathon", "Robotics", "Esports", "Design sprints", "Keynotes"];

const QUICK_LINKS = NAV_LINKS.filter((l) => l.id !== "home");

/** Site footer: marquee band, quick links, newsletter, socials and back-to-top. */
export const Footer = memo(function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative z-10 mt-8 border-t border-border/70 bg-background/60">
      <div aria-hidden className="overflow-hidden border-b border-border/60 py-5">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap will-change-transform">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex gap-10">
              {MARQUEE.map((word) => (
                <span
                  key={`${pass}-${word}`}
                  className="font-display text-sm uppercase tracking-[0.4em] text-muted-foreground/60"
                >
                  {word}
                  <span className="ml-10 text-primary/70">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.3fr_1fr_1.2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {FEST.name} {FEST.edition} — {FEST.dates}. {FEST.venue}.
          </p>
          <Button
            className="mt-6"
            size="sm"
            variant="outline"
            onClick={() => scrollToSection("#registration")}
          >
            Register Now
          </Button>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
            Quick links
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
            Newsletter
          </h2>
          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                className="mt-5 inline-flex items-center gap-2 text-sm text-primary"
              >
                <FiCheck /> You are on the list. Watch your inbox.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={subscribe}
                noValidate
                className="mt-5"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    maxLength={140}
                    placeholder="you@college.edu"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    aria-invalid={Boolean(error)}
                    className="w-full rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-primary/60 focus:shadow-[0_0_24px_-6px_var(--primary)]"
                  />
                  <Button type="submit" size="sm" loading={loading} className="shrink-0">
                    {loading ? "Joining" : "Join"}
                  </Button>
                </div>
                {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
              </motion.form>
            )}
          </AnimatePresence>

          <ul className="mt-7 flex flex-wrap gap-3">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
                >
                  <Icon size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 border-t border-border/60 px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {FEST.name}. All rights reserved.
        </p>
        <button
          type="button"
          onClick={scrollToTop}
          className="group inline-flex items-center gap-2 font-display uppercase tracking-[0.26em] text-foreground/80 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back to top
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50">
            <FiArrowUp size={14} />
          </span>
        </button>
      </div>
    </footer>
  );
});

export default Footer;
