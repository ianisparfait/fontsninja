"use client";

import { type ReactNode, useEffect, useState } from "react";

import { useTheme } from "next-themes";

export default function ThemeToggle(): ReactNode {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    document.cookie = `theme=${resolvedTheme}; path=/; max-age=31536000`; // 1 an
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="relative inline-flex items-center h-[48px] cursor-pointer transition-colors duration-250 ease-[cubic-bezier(0.165,0.84,0.44,1)] py-4 px-6 text-deep-white bg-primary hover:bg-primary-accent rounded-2xl"
      >
        Switch theme
      </button>
    </div>
  );
}
