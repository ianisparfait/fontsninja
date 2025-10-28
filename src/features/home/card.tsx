"use client";

import { type ReactNode } from "react";

import Link from "next/link";

import SvgRenderer from "@/components/svg";

import type { FontFamily } from "@/types/Font";

import { cn } from "@/lib/utils";

interface FontCardProps {
  family: FontFamily;
}

const Text = ({ text, className }: { text: string; className?: string }): ReactNode => {
  if (!text.trim())
    return <p className={cn("text-sm font-normal leading-4 overflow-ellipsis whitespace-nowrap", className)}>&nbsp;</p>;

  return <p className={cn("text-sm font-normal leading-4 overflow-ellipsis whitespace-nowrap", className)}>{text}</p>;
};

export function FontCard({ family }: FontCardProps): ReactNode {
  return (
    <Link href={family.url}>
      <div className="h-[416px] pt-16 px-14 pb-10 flex bg-muted rounded-4xl">
        <div className="flex flex-col justify-between flex-[1_1_0%] max-w-full">
          <div className="pb-12 relative flex items-end flex-[1_1_0%]">
            <div className="relative">
              <SvgRenderer
                svgContent={family.images.alphabet.svg}
                className="[&_path]:fill-foreground data-[theme=dark]:[&_path]:fill-foreground max-h-[230px] w-auto"
              />
            </div>
          </div>
          <div className="flex justify-between max-w-full">
            <div className="max-w-[calc(100%-90px)] flex flex-col">
              {family.name ? (
                <Text text={family.name} className="mb-0.5 font-bold" />
              ) : (
                <Text text={""} className="mb-0.5" />
              )}
              {family.foundry ? family.foundry.name && <Text text={family.foundry.name} /> : <Text text={""} />}
            </div>
            <div className="flex flex-col max-w-[90px]">
              {family.price ? (
                <Text text={`From ${family.price.formatedPrice}`} className="mb-0.5" />
              ) : (
                <Text text={""} className="mb-0.5" />
              )}
              {family.totalFonts ? (
                <Text text={`${family.totalFonts} ${family.totalFonts > 1 ? "styles" : "style"}`} />
              ) : (
                <Text text={""} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>

    // <Link
    //   href={family.url}
    //   className="bg-muted rounded-4xl px-2 py-4 text-foreground flex flex-col justify-between gap-4 items-center transition-all"
    // >
    //   <div>
    //     <SvgRenderer
    //       svgContent={family.images.alphabet.svg}
    //       className="[&_path]:fill-foreground data-[theme=dark]:[&_path]:fill-foreground w-full"
    //     />
    //   </div>
    //   <div className="max-w-[325px] flex justify-center w-full">
    //     <div className="flex justify-between w-full">
    //       <div className="grid gap-0.5 items-center">
    //         {family.name && <Text text={family.name} className="font-bold" />}
    //         {family.foundry && family.foundry.name && <Text text={family.foundry.name} />}
    //       </div>
    //       <div className="grid gap-0.5 items-center">
    //         {family.price && <Text text={`From ${family.price.formatedPrice}`} />}
    //         {family.totalFonts && <Text text={`${family.totalFonts} ${family.totalFonts > 1 ? "styles" : "style"}`} />}
    //       </div>
    //     </div>
    //   </div>
    // </Link>
  );
}
