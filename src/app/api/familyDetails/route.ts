import { NextResponse } from "next/server";

import { type FontFamily } from "@/types/Font";

import familyDetails from "@/data/fontDetails.json";

export const GET = async (): Promise<NextResponse<FontFamily>> => {
  return NextResponse.json(familyDetails);
};
