"use client";

import { type ReactNode, useState, useEffect } from "react";

import { useParams } from "next/navigation";

import SvgRenderer from "@/components/svg";

import { type FontDetails } from "@/types/Font";

import { cn } from "@/lib/utils";

type ViewType = "pangram" | "alphabet";

export default function FontDetailPage(): ReactNode {
  const params = useParams();

  const [fontDetails, setFontDetails] = useState<FontDetails | null>(null);
  const [viewType, setViewType] = useState<ViewType>("pangram");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFontDetails = async (): Promise<void> => {
      try {
        const res = await fetch("/api/familyDetails");
        const data = await res.json();
        setFontDetails(data);

        document.title = `${data.foundry.name} ${data.name}`;
      } catch (error) {
        console.error("Error fetching font details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFontDetails().catch(() => {
      console.error("Error fetching font details"); // TODO: handle error
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center" style={{ color: "var(--text)" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!fontDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center" style={{ color: "var(--text)" }}>
          Font not found
        </div>
      </div>
    );
  }

  const currentImage = viewType === "pangram" ? fontDetails.images.pangram : fontDetails.images.alphabet;

  return (
    <div className="flex gap-2.5 px-8 py-10 flex-col 2xl:flex-row">
      <div className="bg-muted flex-1 rounded-4xl px-12 py-10">
        <div className="grid gap-16">
          <div className="min-h-[500px]">
            <SvgRenderer
              svgContent={currentImage.svg}
              className="[&_path]:fill-foreground data-[theme=dark]:[&_path]:fill-foreground w-full"
            />
          </div>
          <div className="flex gap-[14px]">
            <button
              onClick={() => setViewType("pangram")}
              className={cn(
                "bg-transparent border-none py-3 text-foreground font-medium cursor-pointer select-none",
                viewType === "pangram" && "text-primary pointer-events-none cursor-default",
              )}
            >
              Pangram
            </button>
            <button
              onClick={() => setViewType("alphabet")}
              className={cn(
                "bg-transparent border-none py-3 text-foreground font-medium cursor-pointer select-none",
                viewType === "alphabet" && "text-primary pointer-events-none cursor-default",
              )}
            >
              Alphabet
            </button>
          </div>
        </div>
      </div>
      <div className="bg-muted flex-1 2xl:max-w-[437px] rounded-4xl px-12 py-10">
        <p className="font-bold text-2xl text-foreground">{fontDetails.name}</p>
        {fontDetails.foundry && fontDetails.foundry.name && (
          <p className="font-medium text-foreground">{`From ${fontDetails.foundry.name}`}</p>
        )}
      </div>
    </div>
  );
}
