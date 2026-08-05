import { useEffect, useState } from "react";

/** True after hydration — gate browser-only rendering (WebGL, storage). */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export default useHydrated;
