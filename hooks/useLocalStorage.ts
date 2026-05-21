"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/utils/storage";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback));

  const updateValue = useCallback(
    (nextValue: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved = typeof nextValue === "function" ? (nextValue as (current: T) => T)(current) : nextValue;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, updateValue] as const;
}
