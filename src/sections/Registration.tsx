import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { useRegistration } from "@/context/RegistrationContext";
import { DEPARTMENTS, EVENTS, YEARS } from "@/data/fest";

interface FormState {
  name: string;
  college: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  event: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  college: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  event: "",
};

/** Field-level validation. Returns a message per invalid field. */
function validate(values: FormState): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  if (!name) errors.name = "Full name is required.";
  else if (name.length < 3) errors.name = "Please enter at least 3 characters.";
  else if (name.length > 80) errors.name = "Name must be under 80 characters.";

  const college = values.college.trim();
  if (!college) errors.college = "College name is required.";
  else if (college.length > 120) errors.college = "College must be under 120 characters.";

  const email = values.email.trim();
  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter a valid email address.";

  const phone = values.phone.replace(/[\s-]/g, "");
  if (!phone) errors.phone = "Phone number is required.";
  else if (!/^\+?\d{10,14}$/.test(phone)) errors.phone = "Enter a valid 10-14 digit number.";

  if (!values.department) errors.department = "Select your department.";
  if (!values.year) errors.year = "Select your year of study.";
  if (!values.event) errors.event = "Select an event.";
  return errors;
}

const inputClass =
  "w-full rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-primary/60 focus:shadow-[0_0_24px_-6px_var(--primary)]";

export function Registration() {
  const { selectedEvent, setSelectedEvent } = useRegistration();
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Event cards can pre-select a track before scrolling the user here.
  useEffect(() => {
    if (selectedEvent) setValues((v) => ({ ...v, event: selectedEvent }));
  }, [selectedEvent]);

  const set = (key: keyof FormState, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = document.getElementById(`reg-${Object.keys(found)[0]}`);
      first?.focus();
      return;
    }
    setLoading(true);
    // Local submission: the confirmation is generated client-side.
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(
      `${values.name.trim()}, your seat for ${values.event} is confirmed. A confirmation has been sent to ${values.email.trim()}.`,
    );
    setValues(EMPTY);
    setSelectedEvent("");
  }

  return (
    <Section
      id="registration"
      eyebrow="Registration"
      title="Lock in your seat"
      description="One form per event. Fill it in once and you will receive your team ID and check-in QR by email within a few minutes."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]" data-fx="fade-scale">
        <GlassCard still className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                role="status"
              >
                <FiCheckCircle className="text-primary drop-shadow-[0_0_18px_var(--primary)]" size={54} />
                <h3 className="mt-6 font-display text-xl uppercase tracking-[0.14em] text-foreground">
                  Registration confirmed
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {success}
                </p>
                <Button className="mt-8" variant="outline" onClick={() => setSuccess(null)}>
                  Register another entry
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
                <Field id="reg-name" label="Full name" error={errors.name}>
                  <input
                    id="reg-name"
                    className={inputClass}
                    value={values.name}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Aarav Menon"
                    onChange={(e) => set("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                  />
                </Field>

                <Field id="reg-college" label="College" error={errors.college}>
                  <input
                    id="reg-college"
                    className={inputClass}
                    value={values.college}
                    maxLength={120}
                    autoComplete="organization"
                    placeholder="Institute of Advanced Technology"
                    onChange={(e) => set("college", e.target.value)}
                    aria-invalid={Boolean(errors.college)}
                  />
                </Field>

                <Field id="reg-email" label="Email" error={errors.email}>
                  <input
                    id="reg-email"
                    type="email"
                    className={inputClass}
                    value={values.email}
                    maxLength={140}
                    autoComplete="email"
                    placeholder="you@college.edu"
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>

                <Field id="reg-phone" label="Phone" error={errors.phone}>
                  <input
                    id="reg-phone"
                    type="tel"
                    className={inputClass}
                    value={values.phone}
                    maxLength={18}
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    onChange={(e) => set("phone", e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </Field>

                <Field id="reg-department" label="Department" error={errors.department}>
                  <select
                    id="reg-department"
                    className={inputClass}
                    value={values.department}
                    onChange={(e) => set("department", e.target.value)}
                    aria-invalid={Boolean(errors.department)}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-background">
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="reg-year" label="Year of study" error={errors.year}>
                  <select
                    id="reg-year"
                    className={inputClass}
                    value={values.year}
                    onChange={(e) => set("year", e.target.value)}
                    aria-invalid={Boolean(errors.year)}
                  >
                    <option value="">Select year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y} className="bg-background">
                        {y}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field id="reg-event" label="Event" error={errors.event}>
                    <select
                      id="reg-event"
                      className={inputClass}
                      value={values.event}
                      onChange={(e) => set("event", e.target.value)}
                      aria-invalid={Boolean(errors.event)}
                    >
                      <option value="">Select an event</option>
                      {EVENTS.map((ev) => (
                        <option key={ev.id} value={ev.title} className="bg-background">
                          {ev.title} — {ev.tagline}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
                    {loading ? "Submitting" : "Submit registration"}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>

        <GlassCard tone="secondary" className="p-6 md:p-8">
          <h3 className="font-display text-sm uppercase tracking-[0.24em] text-secondary">
            Before you submit
          </h3>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {[
              "Use your college email where possible — it speeds up ID verification.",
              "Team leads register once per event and add members from the dashboard link in the confirmation mail.",
              "Registrations close on 20 December or when a track fills up, whichever comes first.",
              "Outstation participants can request subsidised accommodation from the same confirmation mail.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                {line}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </Section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-display text-[0.55rem] uppercase tracking-[0.28em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Registration;
