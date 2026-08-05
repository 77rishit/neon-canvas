import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { Section } from "@/components/Section";
import { FAQS } from "@/data/fest";

/** Accordion where only one panel can be open at a time. */
export function FAQ() {
  const [open, setOpen] = useState<string | null>(FAQS[0]?.q ?? null);

  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Everything you might ask"
      description="Still stuck? The contact form below reaches the operations desk directly and is answered within a working day."
    >
      <div className="grid gap-3" data-fx="stagger">
        {FAQS.map((faq) => {
          const expanded = open === faq.q;
          return (
            <div
              key={faq.q}
              className={`glass-panel overflow-hidden rounded-2xl transition-colors duration-300 ${
                expanded ? "border-primary/40" : "hover:border-primary/25"
              }`}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : faq.q)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="font-display text-sm uppercase tracking-[0.08em] text-foreground md:text-base">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`shrink-0 ${expanded ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <FiPlus size={20} />
                  </motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export default FAQ;
