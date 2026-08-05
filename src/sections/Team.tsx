import { motion } from "framer-motion";
import { FiMail, FiLinkedin } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { TEAM, FEST } from "@/data/fest";

export function Team() {
  return (
    <Section
      id="team"
      eyebrow="Core team"
      title="The people running the grid"
      description="A student-led core of forty, backed by three hundred volunteers. Reach any lead directly — the whole team answers its own mail."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-fx="stagger">
        {TEAM.map((member, i) => (
          <GlassCard key={member.name} floatIndex={i} tone={i % 2 ? "secondary" : "primary"}>
            <div className="flex items-center gap-4">
              <motion.span
                whileHover={{ scale: 1.08, rotate: 4 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                aria-hidden
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-[image:var(--gradient-neon)]/10 font-display text-lg text-primary"
              >
                {member.initials}
              </motion.span>
              <div>
                <h3 className="font-display text-base uppercase tracking-[0.1em] text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 font-display text-[0.55rem] uppercase tracking-[0.28em] text-muted-foreground">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${FEST.email}?subject=${encodeURIComponent(`For ${member.name} — ${member.role}`)}`}
                aria-label={`Email ${member.name}`}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
              >
                <FiMail size={16} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${member.name} on LinkedIn`}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:text-secondary"
              >
                <FiLinkedin size={16} />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

export default Team;
