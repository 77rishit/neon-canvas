import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { scrollToSection } from "@/utils/scroll";

interface RegistrationContextValue {
  /** Event title pre-selected in the registration form. */
  selectedEvent: string;
  setSelectedEvent: (title: string) => void;
  /** Pre-selects an event and scrolls the user to the registration form. */
  registerFor: (title: string) => void;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState("");

  const registerFor = useCallback((title: string) => {
    setSelectedEvent(title);
    scrollToSection("#registration");
  }, []);

  const value = useMemo(
    () => ({ selectedEvent, setSelectedEvent, registerFor }),
    [selectedEvent, registerFor],
  );

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used inside <RegistrationProvider>");
  return ctx;
}
