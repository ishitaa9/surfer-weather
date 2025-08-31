import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 350) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}
