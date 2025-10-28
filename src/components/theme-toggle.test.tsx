import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ThemeToggle from "./theme-toggle";

// Mock next-themes
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

describe("ThemeToggle", (): void => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render before mounting (SSR)", () => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    const { container } = render(<ThemeToggle />);
    expect(container.firstChild).toBeNull();
  });

  it("should render button after mounting", async (): Promise<void> => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /switch theme/i })).toBeInTheDocument();
    });
  });

  it("should have correct aria-label for light theme", async (): Promise<void> => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
    });
  });

  it("should have correct aria-label for dark theme", async (): Promise<void> => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Switch to light mode");
    });
  });

  it("should call setTheme when clicked", async (): Promise<void> => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it("should display correct button text", async (): Promise<void> => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByText("Switch theme")).toBeInTheDocument();
    });
  });

  it("should have proper accessibility attributes", async (): Promise<void> => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
      expect(button.tagName).toBe("BUTTON");
    });
  });
});
