import { type ReactNode, Fragment } from "react";

import type { FontFamily } from "@/types/Font";
import type { Metadata } from "next";

import FontViewer from "@/features/font/viewer";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getFamily();
  return {
    title: `${data.foundry.name} ${data.name}`,
  };
}

const getFamily = async (): Promise<FontFamily> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/familyDetails`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch family");
  }

  return res.json();
};

export default async function FontDetailPage(): Promise<ReactNode> {
  const fontDetails = await getFamily();

  return (
    <div className="flex gap-2 px-8 py-10 flex-col 2xl:flex-row">
      <div className="bg-muted flex-1 rounded-4xl pt-10 px-12 pb-8 min-h-[592px] relative">
        <div className="flex flex-col justify-between h-full">
          <FontViewer fontDetails={fontDetails} />
        </div>
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
