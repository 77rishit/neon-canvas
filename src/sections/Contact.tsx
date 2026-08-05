import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FaInstagram, FaXTwitter, FaLinkedin, FaDiscord, FaGithub } from "react-icons/fa6";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { FEST } from "@/data/fest";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Errors = Partial<Record<keyof ContactForm, string>>;

const EMPTY: ContactForm = { name: "", email: "", subject: "", message: "" };

function validate(v: ContactForm): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Name is required.";
  else if (v.name.trim().length > 80) e.name = "Keep it under 80 characters.";
  if (!v.email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email.";
  if (!v.subject.trim()) e.subject = "Add a short subject.";
  else if (v.subject.trim().length > 120) e.subject = "Keep it under 120 characters.";
  if (!v.message.trim()) e.message = "Message cannot be empty.";
  else if (v.message.trim().length < 12) e.message = "Tell us a little more (12+ characters).";
  else if (v.message.trim().length > 1000) e.message = "Keep it under 1000 characters.";
  return e;
}

const inputClass =
  "w-full rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-primary/60 focus:shadow-[0_0_24px_-6px_var(--primary)]";

export const SOCIALS = [
  { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com" },
  { label: "X", icon: FaXTwitter, href: "https://x.com" },
  { label: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com" },
  { label: "Discord", icon: FaDiscord, href: "https://discord.com" },
  { label: "GitHub", icon: FaGithub, href: "https://github.com" },
];

export function Contact() {
  const [values, setValues] = useState<ContactForm>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof ContactForm, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
    setValues(EMPTY);
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Talk to the desk"
      description="Sponsorships, press passes, accessibility requests or plain curiosity — this form reaches a human."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]" data-fx="fade-scale">
        <GlassCard still className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                role="status"
                className="flex min-h-[22rem] flex-col items-center justify-center text-center"
              >
                <FiCheckCircle size={50} className="text-primary drop-shadow-[0_0_18px_var(--primary)]" />
                <h3 className="mt-6 font-display text-lg uppercase tracking-[0.14em]">Message sent</h3>
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                  Thanks for reaching out. The operations desk replies within one working day.
                </p>
                <Button variant="outline" className="mt-8" onClick={() => setSent(false)}>
                  Send another
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={onSubmit}
                noValidate
                className="grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <input
                    id="contact-name"
                    className={inputClass}
                    value={values.name}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Your name"
                    onChange={(e) => set("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                  />
                  <FieldError message={errors.name} />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <input
                    id="contact-email"
                    type="email"
                    className={inputClass}
                    value={values.email}
                    maxLength={140}
                    autoComplete="email"
                    placeholder="you@domain.com"
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                  />
                  <FieldError message={errors.email} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <input
                    id="contact-subject"
                    className={inputClass}
                    value={values.subject}
                    maxLength={120}
                    placeholder="Sponsorship enquiry"
                    onChange={(e) => set("subject", e.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                  />
                  <FieldError message={errors.subject} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    maxLength={1000}
                    className={`${inputClass} resize-y`}
                    value={values.message}
                    placeholder="Tell us what you need…"
                    onChange={(e) => set("message", e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                  />
                  <FieldError message={errors.message} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
                    {loading ? "Sending" : "Send message"}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>

        <div className="grid gap-6">
          <GlassCard tone="secondary">
            <h3 className="font-display text-sm uppercase tracking-[0.24em] text-secondary">
              Fest desk
            </h3>
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${FEST.email}`}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <FiMail className="text-primary" /> {FEST.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${FEST.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <FiPhone className="text-primary" /> {FEST.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <FiMapPin className="mt-1 shrink-0 text-primary" /> {FEST.venue}
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </GlassCard>

          <GlassCard still className="overflow-hidden p-0">
            <div className="relative h-56 w-full">
              <iframe
                title={`Map to ${FEST.venue}`}
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.55%2C12.93%2C77.65%2C13.01&layer=mapnik"
                loading="lazy"
                className="h-full w-full grayscale-[0.4] contrast-125 [filter:invert(0.92)_hue-rotate(170deg)]"
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <p className="text-xs text-muted-foreground">Campus map · Bengaluru</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Bengaluru"
                target="_blank"
                rel="noreferrer noopener"
                className="font-display text-[0.55rem] uppercase tracking-[0.26em] text-primary hover:text-secondary"
              >
                Open in maps
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </Section>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-display text-[0.55rem] uppercase tracking-[0.28em] text-muted-foreground"
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string | undefined }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs text-destructive"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default Contact;
