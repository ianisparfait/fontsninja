import { type ReactNode } from "react";

import { type Metadata } from "next";

import type { FamiliesResponse } from "@/types/Font";

import { FontCard } from "@/features/home/card";
import { Pagination } from "@/features/home/pagination";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export const generateMetadata = async ({ searchParams }: HomePageProps): Promise<Metadata> => {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  return {
    title: `Home - Page ${page}`,
  };
};

const getFamilies = async (page: number): Promise<FamiliesResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/families?page=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch families");
  }

  return res.json();
};

export default async function HomePage({ searchParams }: HomePageProps): Promise<ReactNode> {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const data = await getFamilies(currentPage);

  const itemsPerPage = 24;
  const totalPages = Math.ceil(data.totalFamilies / itemsPerPage);

  return (
    <div className="px-14 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 transition-all">
        {data.families.map((family) => (
          <FontCard key={family.idFont} family={family} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
