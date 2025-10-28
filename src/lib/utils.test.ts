import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge classes correctly", () => {
    const result = cn("text-base", "text-lg");
    expect(result).toBe("text-lg");
  });

  it("should handle conditional classes", () => {
    const result = cn("text-base", false && "hidden", "bg-red");
    expect(result).toBe("text-base bg-red");
  });

  it("should merge conflicting Tailwind classes correctly", () => {
    const result = cn("p-4 px-2", "p-6");
    expect(result).toBe("px-2 p-6");
  });

  it("should handle arrays of classes", () => {
    const result = cn(["text-base", "font-bold"], "text-lg");
    expect(result).toBe("font-bold text-lg");
  });

  it("should handle undefined and null values", () => {
    const result = cn("text-base", undefined, null, "font-bold");
    expect(result).toBe("text-base font-bold");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle complex responsive classes", () => {
    const result = cn("text-sm md:text-base", "text-xs md:text-lg");
    expect(result).toBe("text-xs md:text-lg");
  });

  it("should handle object notation from clsx", () => {
    const result = cn({ "text-base": true, "font-bold": false, "text-red": true });
    expect(result).toBe("text-base text-red");
  });
});
