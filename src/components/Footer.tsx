import { memo } from "react";
import { FiArrowUpRight, FiGithub, FiTwitter, FiDribbble, FiLinkedin } from "react-icons/fi";
import { Logo } from "@/components/Logo";

const SITEMAP = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
];

const RESOURCES = [
  { label: "Work", href: "#work" },
  { label: "Timeline", href: "#timeline" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const SOCIALS = [
  { label: "GitHub", icon: FiGithub, href: "#contact" },
  { label: "Twitter", icon: FiTwitter, href: "#contact" },
  { label: "Dribbble", icon: FiDribbble, href: "#contact" },
  { label: "LinkedIn", icon: FiLinkedin, href: "#contact" },
];

const MARQUEE = [
  "Realtime 3D",
  "Design engineering",
  "Motion systems",
  "Brand worlds",
  "Performance",
];

/** Site footer: marquee band, sitemap, contact CTA and legal strip. */
export const Footer = memo(function Footer() {
  return (
    <footer className="relative z-10 mt-8 border-t border-border/70 bg-background/60">
      {/* Kinetic keyword band */}
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

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            A realtime design engineering studio building interfaces that feel like hardware.
            Berlin — Tokyo — remote.
          </p>
          <a
            href="#contact"
            className="group mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-primary"
          >
            Start a project
            <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <FooterColumn title="Studio" links={SITEMAP} />
        <FooterColumn title="Explore" links={RESOURCES} />

        <div>
          <h2 className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
            Connect
          </h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
                >
                  <Icon size={17} />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="mt-5 inline-block text-sm text-foreground transition-colors hover:text-primary"
          >
            studio@neogrid.dev
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 border-t border-border/60 px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} NEO//GRID Studio. All rights reserved.</p>
        <p className="font-display uppercase tracking-[0.28em]">
          Built with React, R3F &amp; GSAP
        </p>
      </div>
    </footer>
  );
});

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
