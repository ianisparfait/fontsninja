"use client";

import { type ReactNode, useEffect, useState } from "react";

import SvgRenderer from "@/components/svg/SVGRenderer.server";

import type { FontFamily } from "@/types/Font";

import { cn } from "@/lib/utils";

type ViewType = "pangram" | "alphabet";

interface Props {
  fontDetails: FontFamily;
}

export default function FontViewer({ fontDetails }: Props): ReactNode {
  const [viewType, setViewType] = useState<ViewType>("pangram");

  const currentImage = viewType === "pangram" ? fontDetails?.images.pangram : fontDetails?.images.alphabet;

  useEffect(() => {
    document.title = `${fontDetails.foundry.name} ${fontDetails.name}`;
  }, [fontDetails.foundry.name, fontDetails.name]);

  return (
    <>
      <div className="items-start flex mb-8 m-h-auto">
        <SvgRenderer
          svgContent={currentImage?.svg}
          className="[&_path]:fill-foreground data-[theme=dark]:[&_path]:fill-foreground w-auto max-h-[212px] md:max-h-[372px] lg:max-h-[418px] xl:max-h-[440px]"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewType("pangram")}
            className={cn(
              "relative flex items-center justify-center border-none outline-none transition-colors",
              viewType === "pangram" && "text-primary pointer-events-none cursor-default",
            )}
          >
            Pangram
          </button>
          <button
            onClick={() => setViewType("alphabet")}
            className={cn(
              "relative flex items-center justify-center border-none outline-none transition-colors",
              viewType === "alphabet" && "text-primary pointer-events-none cursor-default",
            )}
          >
            Alphabet
          </button>
        </div>
      </div>
    </>
  );
}
