import { useMemo } from 'react';

export interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  hue: 'white' | 'blue' | 'warm' | 'red';
  bright: boolean;
}

/**
 * Generates a deterministic star field so layout doesn't jump on re-render.
 * Stars have varied colors, sizes, and brightness for realistic depth.
 */
export function useStars(count: number, seed = 42): Star[] {
  return useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const hues: Star['hue'][] = ['white', 'white', 'white', 'blue', 'warm', 'red'];
    return Array.from({ length: count }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: 0.4 + rand() * 3,
      opacity: 0.25 + rand() * 0.75,
      delay: rand() * 5,
      duration: 2 + rand() * 5,
      hue: hues[Math.floor(rand() * hues.length)],
      bright: rand() > 0.88,
    }));
  }, [count, seed]);
}

const hueColors: Record<Star['hue'], string> = {
  white: '#ffffff',
  blue: '#aac8ff',
  warm: '#ffe8c8',
  red: '#ffb0a0',
};

export function starColor(hue: Star['hue']) {
  return hueColors[hue];
}
