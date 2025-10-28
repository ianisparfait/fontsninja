import type { Foundry } from "@/types/Foundry";
import type { Image, Images } from "@/types/Image";
import type { Price } from "@/types/Price";

export type FontFamily = {
  idFont: number;
  url: string;
  idRegularFont?: number;
  vendorId?: string;
  price: Price | null;
  idFamily: string;
  name: string;
  totalFonts: number;
  foundry: Foundry;
  images: Images;
};

export type FamiliesResponse = {
  families: FontFamily[];
  totalFamilies: number;
};

export type FamiliesResponseError = {
  error: string;
};

export type FontDetails = {
  images: {
    alphabet: Image;
    pangram: Image;
  };
} & FontFamily;
