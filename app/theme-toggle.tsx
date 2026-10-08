'use client';

import { useEffect, useState } from 'react';

const storageKey = 'quantumdev-theme';
type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(storageKey); } catch { /* Storage may be disabled. */ }
      const next = saved === 'light' || saved === 'dark' ? saved : media.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    // The head script already selected the initial theme before first paint.
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) apply();
    };
    media.addEventListener('change', apply);
    window.addEventListener('storage', onStorage);
    return () => {
      media.removeEventListener('change', apply);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Still switch for this visit. */ }
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle}
      aria-label="Dark theme" aria-pressed={theme === 'dark'} title="Switch light / dark theme">
      <svg className="theme-moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z" />
      </svg>
      <svg className="theme-sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
    </button>
  );
}
