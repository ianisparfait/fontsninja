import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";

import type { FontFamily } from "@/types/Font";

import { FontCard } from "./card";

// Mock SvgRenderer component
vi.mock("@/components/svg", () => ({
  default: ({ svgContent, className }: { svgContent: string; className?: string }) => (
    <div data-testid="svg-renderer" className={className}>
      {svgContent}
    </div>
  ),
}));

describe("FontCard", () => {
  const mockFontFamily: FontFamily = {
    idFont: 1,
    idFamily: "1",
    name: "Roboto",
    url: "/font/roboto",
    foundry: {
      name: "Google Fonts",
      id: "google",
      totalFamilies: 12,
    },
    price: {
      formatedPrice: "$29.99",
      amount: 29.99,
      currency: "USD",
    },
    totalFonts: 12,
    images: {
      alphabet: {
        svg: "<svg><path d='M0 0' /></svg>",
        width: 300,
        height: 300,
      },
    },
  };

  it("should render font card with all information", () => {
    render(<FontCard family={mockFontFamily} />);

    expect(screen.getByText("Roboto")).toBeInTheDocument();
    expect(screen.getByText("Google Fonts")).toBeInTheDocument();
    expect(screen.getByText("From $29.99")).toBeInTheDocument();
    expect(screen.getByText("12 styles")).toBeInTheDocument();
  });

  it("should render as a link with correct href", () => {
    render(<FontCard family={mockFontFamily} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/font/roboto");
  });

  it("should render SVG with correct content", () => {
    render(<FontCard family={mockFontFamily} />);

    const svg = screen.getByTestId("svg-renderer");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveTextContent("<svg><path d='M0 0' /></svg>");
  });

  it("should display singular 'style' for single font", () => {
    const singleFont: FontFamily = {
      ...mockFontFamily,
      totalFonts: 1,
    };

    render(<FontCard family={singleFont} />);

    expect(screen.getByText("1 style")).toBeInTheDocument();
    expect(screen.queryByText("styles")).not.toBeInTheDocument();
  });

  it("should display plural 'styles' for multiple fonts", () => {
    render(<FontCard family={mockFontFamily} />);

    expect(screen.getByText("12 styles")).toBeInTheDocument();
  });

  it("should not render NaN text values", () => {
    const fontWithNaN: FontFamily = {
      ...mockFontFamily,
      name: "NaN",
    };

    render(<FontCard family={fontWithNaN} />);

    expect(screen.queryByText("NaN")).not.toBeInTheDocument();
  });

  it("should handle missing foundry name gracefully", () => {
    const fontWithoutFoundry: FontFamily = {
      ...mockFontFamily,
      foundry: {
        ...mockFontFamily.foundry,
        name: "",
      },
    };

    render(<FontCard family={fontWithoutFoundry} />);

    expect(screen.getByText("Roboto")).toBeInTheDocument();
    expect(screen.queryByText("Google Fonts")).not.toBeInTheDocument();
  });

  it("should handle missing price gracefully", () => {
    const fontWithoutPrice: FontFamily = {
      ...mockFontFamily,
      price: null,
    };

    render(<FontCard family={fontWithoutPrice} />);

    expect(screen.getByText("Roboto")).toBeInTheDocument();
    expect(screen.queryByText(/From \$/)).not.toBeInTheDocument();
  });

  it("should have proper layout classes", () => {
    const { container } = render(<FontCard family={mockFontFamily} />);

    const link = container.querySelector("a");
    expect(link).toHaveClass("bg-muted", "rounded-4xl", "px-2", "py-4");
  });

  it("should render all sections with correct structure", () => {
    render(<FontCard family={mockFontFamily} />);

    // SVG section
    expect(screen.getByTestId("svg-renderer")).toBeInTheDocument();

    // Text information
    expect(screen.getByText("Roboto")).toBeInTheDocument();
    expect(screen.getByText("Google Fonts")).toBeInTheDocument();
    expect(screen.getByText("From $29.99")).toBeInTheDocument();
    expect(screen.getByText("12 styles")).toBeInTheDocument();
  });
});
