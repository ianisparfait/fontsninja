"use client";

import { type ReactNode, useEffect, useState } from "react";

import { useTheme } from "next-themes";

export default function ThemeToggle(): ReactNode {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="bg-primary text-deep-white rounded-2xl pt-[18px] pb-[19px] px-6 flex items-center justify-center gap-2 font-medium max-h-[49px] cursor-pointer"
      >
        Switch theme
      </button>
    </div>
  );
}
