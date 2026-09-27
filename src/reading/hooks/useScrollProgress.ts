import { createContext, useContext, useRef } from 'react';

export const SceneProgressContext = createContext(0);

/** Progress is controlled by the scene player while the section stays on screen. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const progress = useContext(SceneProgressContext);
  return { ref, progress };
}
