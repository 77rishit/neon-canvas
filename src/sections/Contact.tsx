import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiSend, FiGithub, FiTwitter, FiDribbble } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";
import { Button } from "@/components/Button";

const FIELD =
  "w-full rounded-lg border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-[color,background-color,border-color,box-shadow] duration-300 focus:border-primary/60 focus:bg-primary/5 focus:shadow-[0_0_28px_-8px_var(--primary)] hover:border-primary/30";

export function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Open a channel"
      description="Tell us what you're building. We reply to every serious brief within two working days."
      className="overflow-hidden pb-32"
    >
      <ParallaxBackdrop align="right" />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="grid gap-4 content-start">
          <RevealItem>
            <GlassCard className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <FiMail size={19} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Email
                </p>
                <p className="mt-1 truncate text-sm text-foreground">studio@neogrid.dev</p>
              </div>
            </GlassCard>
          </RevealItem>

          <RevealItem>
            <GlassCard tone="secondary" className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-secondary/30 bg-secondary/10 text-secondary">
                <FiMapPin size={19} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Studio
                </p>
                <p className="mt-1 text-sm text-foreground">Berlin — Tokyo — remote</p>
              </div>
            </GlassCard>
          </RevealItem>

          <RevealItem>
            <GlassCard still className="flex items-center gap-3">
              {[FiGithub, FiTwitter, FiDribbble].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#contact"
                  whileHover={{ y: -4, scale: 1.06 }}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </GlassCard>
          </RevealItem>
        </Reveal>

        <Reveal delay={0.12}>
          <RevealItem>
            <GlassCard still className="p-7">
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-display text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                      Name
                    </span>
                    <input required name="name" placeholder="Ada Lovelace" className={FIELD} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-display text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="you@company.com"
                      className={FIELD}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block font-display text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                    Budget
                  </span>
                  <select name="budget" className={FIELD} defaultValue="25-50k">
                    <option value="10-25k">$10k — $25k</option>
                    <option value="25-50k">$25k — $50k</option>
                    <option value="50-100k">$50k — $100k</option>
                    <option value="100k+">$100k+</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block font-display text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
                    Brief
                  </span>
                  <textarea
                    required
                    name="brief"
                    rows={5}
                    placeholder="What are you building, and when does it need to ship?"
                    className={`${FIELD} resize-none`}
                  />
                </label>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button type="submit" size="lg" className="group">
                    {sent ? "Signal received" : "Transmit"}
                    <FiSend className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </Button>
                  {sent && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-primary"
                    >
                      Thanks — we'll be in touch shortly.
                    </motion.span>
                  )}
                </div>
              </form>
            </GlassCard>
          </RevealItem>
        </Reveal>
      </div>
    </Section>
  );
}

export default Contact;
