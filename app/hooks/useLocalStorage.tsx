import { useEffect, useState } from "react";

export const useLocalStorage = <T,>(
  key: string,
  initialValue?: T | undefined
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] => {
  const [state, setState] = useState<T | undefined>(() => {
    if (typeof window === "undefined") {
      // Server-side rendering
      return initialValue;
    }

    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Client-side rendering
      if (state === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    }
  }, [key, state]);

  return [state, setState];
};
