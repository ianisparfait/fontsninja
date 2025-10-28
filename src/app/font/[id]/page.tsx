"use client";

import { type ReactNode, useState, useEffect, Fragment } from "react";

import { Loader2 } from "lucide-react";
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

  const currentImage = viewType === "pangram" ? fontDetails?.images.pangram : fontDetails?.images.alphabet;

  return (
    <div className="flex gap-2 px-8 py-10 flex-col 2xl:flex-row">
      <div className="bg-muted flex-1 rounded-4xl pt-10 px-12 pb-8 min-h-[592px] relative">
        {loading && !currentImage ? (
          <div className="absolute top-4 right-4">
            <div className="bg-pagination-muted rounded-full size-8 flex justify-center items-center">
              <Loader2 className="animate-spin size-3/4 text-pagination" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
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
          </div>
        )}
      </div>
      <div className="bg-muted flex-1 2xl:max-w-[437px] rounded-4xl px-12 py-8">
        {fontDetails && (
          <Fragment>
            <p className="font-bold text-2xl text-foreground">{fontDetails.name}</p>
            {fontDetails.foundry && fontDetails.foundry.name && (
              <p className="font-medium text-foreground">{`From ${fontDetails.foundry.name}`}</p>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}
