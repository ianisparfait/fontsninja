import { NextResponse } from "next/server";

import type { FamiliesResponse, FamiliesResponseError } from "@/types/Font";

export const GET = async (req: Request): Promise<NextResponse<FamiliesResponse | FamiliesResponseError>> => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    const data = await import(`@/data/fontFamiliesPage${page}.json`);
    return NextResponse.json(data.default);
  } catch {
    return NextResponse.json({ error: `No data found for page ${page}` }, { status: 404 });
  }
};
