import { useCallback, useEffect, useRef, useState } from 'react';

const INTRO_MS = 3000;
const TITLE_HOLD_MS = 3500;
const ANIMATION_MS = 24000;
const QUOTE_HOLD_MS = 10000;
const END_HOLD_MS = 3000;
const TITLE_PROGRESS = 0.15;
const QUOTE_PROGRESS = 0.8;

/** Hold readable text on screen before continuing the animation. */
export function getPlaybackFrame(elapsedMs: number, index: number) {
  const blockDuration = index === 0 ? 15000 : 10000;
  const timelineDuration = INTRO_MS + TITLE_HOLD_MS + (1 - TITLE_PROGRESS) * ANIMATION_MS
    + (index === 0 ? QUOTE_HOLD_MS : 0) + END_HOLD_MS;
  // Scale every phase, including reading holds, into the full block duration.
  const elapsed = Math.max(0, elapsedMs) * timelineDuration / blockDuration;
  if (elapsed < INTRO_MS) return { progress: elapsed / INTRO_MS * TITLE_PROGRESS, finished: false };
  let time = Math.max(0, elapsed - INTRO_MS - TITLE_HOLD_MS);
  const quoteTime = (QUOTE_PROGRESS - TITLE_PROGRESS) * ANIMATION_MS;
  if (index === 0 && time > quoteTime) {
    time = Math.max(quoteTime, time - QUOTE_HOLD_MS);
  }
  const progress = Math.min(1, TITLE_PROGRESS + time / ANIMATION_MS);
  return { progress, finished: elapsedMs >= blockDuration };
}

export function useScenePlayback(sceneCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const player = useRef({ index: 0, progress: 0, elapsed: 0, paused: false });

  const togglePaused = useCallback(() => {
    player.current.paused = !player.current.paused;
    setIsPaused(player.current.paused);
  }, []);

  const navigate = useCallback((index: number) => {
    const current = player.current;
    if (index < 0 || index > sceneCount || index === current.index) return;
    if (index > current.index && (index !== current.index + 1 || current.progress < 1)) return;
    player.current = { index, progress: 0, elapsed: 0, paused: false };
    setActiveIndex(index);
    setProgress(0);
    setIsPaused(false);
  }, [sceneCount]);

  useEffect(() => {
    let frame = 0;
    let previousTime: number | null = null;
    const animate = (time: number) => {
      // Never catch up on unseen animation after a hidden tab or a stalled frame.
      const delta = previousTime === null ? 0 : Math.min(time - previousTime, 40);
      previousTime = time;
      const current = player.current;
      if (!current.paused && !document.hidden && current.index < sceneCount) {
        current.elapsed += delta;
        const next = getPlaybackFrame(current.elapsed, current.index);
        current.progress = next.progress;
        setProgress(next.progress);
        if (next.finished) navigate(current.index + 1);
      }
      frame = requestAnimationFrame(animate);
    };
    const onVisibilityChange = () => { previousTime = null; };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== ' ' || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;
      event.preventDefault();
      togglePaused();
    };
    frame = requestAnimationFrame(animate);
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [navigate, sceneCount, togglePaused]);

  const canNavigate = (index: number) => index <= activeIndex || (index === activeIndex + 1 && progress === 1);
  return { activeIndex, progress, navigate, canNavigate, isPaused, togglePaused };
}
