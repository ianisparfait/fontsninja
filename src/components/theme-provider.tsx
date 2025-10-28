"use client";

import { type ReactNode, type ComponentProps } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>): ReactNode {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  );
}
