"use client";

import { type ReactNode } from "react";

import Link from "next/link";

import SvgRenderer from "@/components/svg";
import ThemeToggle from "@/components/theme-toggle";

export default function Header(): ReactNode {
  return (
    <header className="sticky top-0 left-0 right-0 z-20 justify-center flex">
      <div className="flex min-h-16 items-center justify-center sm:justify-between gap-4 w-full px-[56px]">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <Link href={"/"}>
            <SvgRenderer
              src="/logo.svg"
              className="[&_path]:fill-foreground data-[theme=dark]:[&_path]:fill-foreground"
            />
          </Link>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
