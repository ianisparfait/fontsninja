"use client";

import { type ReactNode } from "react";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import SvgRenderer from "@/components/svg";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps): ReactNode {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber > 1) {
      params.set("page", pageNumber.toString());
    } else {
      params.delete("page");
    }
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-2 mt-8">
      <Link
        href={createPageURL(currentPage - 1)}
        className={cn(
          "transition-opacity px-2 py-4 rounded-xl text-pagination select-none",
          currentPage === 1 && "pointer-events-none text-pagination-muted",
        )}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        <SvgRenderer src="/arrows/left-arrow.svg" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={cn(
            "transition-colors rounded-2xl flex justify-center items-center cursor-pointer text-pagination pt-[18px] pb-[19px] px-2 size-10 select-none",
            currentPage === page && "bg-primary text-deep-white pointer-events-none",
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={createPageURL(currentPage + 1)}
        className={cn(
          "transition-opacity px-2 py-4 rounded-xl text-pagination select-none",
          currentPage === totalPages && "pointer-events-none text-pagination-muted",
        )}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        <SvgRenderer src="/arrows/right-arrow.svg" />
      </Link>
    </div>
  );
}
