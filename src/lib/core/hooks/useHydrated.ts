import { useEffect, useState } from "react";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!hydrated) {
      setHydrated(true);

      return;
    }
  }, [hydrated]);

  return hydrated;
};
