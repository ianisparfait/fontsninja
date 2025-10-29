"use client";

import { type ReactNode, useEffect, useState } from "react";

import DOMPurify from "dompurify";

import SvgRendererServer from "./SVGRenderer.server";

interface Props {
  src?: string;
  svgContent?: string;
  className?: string;
  maxHeight?: number | string; // optional visual cap
}

export default function SvgRendererClient({ src, svgContent, className, maxHeight }: Props): ReactNode {
  const [content, setContent] = useState<string | null>(svgContent ?? null);
  const [error, setError] = useState<string | null>(null);
  const [forcedHeight, setForcedHeight] = useState<string | number | null>(null);

  useEffect(() => {
    if (svgContent) {
      setContent(svgContent);
      computeForcedHeight(svgContent);
      return;
    }

    if (!src) return;

    let aborted = false;
    (async () => {
      try {
        const res = await fetch(src, { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch SVG");
        const ct = res.headers.get("content-type") || "";

        // Validate MIME: only accept SVG MIME or text/xml-ish.
        if (!/image\/svg\+xml|text\/xml|application\/xml/i.test(ct)) {
          // If dev serves static /logo.svg, some servers may return text/plain; add fallback:
          const text = await res.text();
          if (!/^\s*<svg[\s>]/i.test(text)) {
            throw new Error(`Invalid content-type (${ct}) and not an inline SVG`);
          }
          // else continue with text
          sanitizeAndSet(text);
          return;
        }

        const text = await res.text();
        sanitizeAndSet(text);
      } catch (e: any) {
        console.error("SvgRenderer fetch error:", e);
        if (!aborted) setError(e?.message ?? "error");
      }
    })();

    return () => {
      aborted = true;
    };
  }, [src, svgContent]);

  const sanitizeAndSet = (raw: string) => {
    // quick guard: ensure starts with <svg
    if (!/^\s*<svg[\s>]/i.test(raw)) {
      setError("Not an SVG");
      return;
    }
    // sanitize with DOMPurify (client-side)
    const clean = DOMPurify.sanitize(raw, { USE_PROFILES: { svg: true } });
    setContent(clean);
    computeForcedHeight(clean);
  };

  const computeForcedHeight = (svg: string) => {
    // Extract viewBox: "minX minY width height"
    const vbMatch = svg.match(/viewBox=["']?([\d\.\-\s]+)["']?/i);
    if (!vbMatch) {
      setForcedHeight(null);
      return;
    }
    const parts = vbMatch[1].trim().split(/\s+/).map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n === 0)) {
      setForcedHeight(null);
      return;
    }
    const intrinsicW = parts[2];
    const intrinsicH = parts[3];
    const ratio = intrinsicW / intrinsicH;

    // If you want the SVG to fill available width but keep equal heights across cards,
    // compute a fixed height based on a target width or maxHeight.
    // Here we respect maxHeight if provided, else do not force.
    if (!maxHeight) {
      setForcedHeight(null);
      return;
    }

    // if maxHeight is a number (px), keep it.
    if (typeof maxHeight === "number") {
      setForcedHeight(`${maxHeight}px`);
      return;
    }

    // if maxHeight like "300px" or "40vh" just use as-is
    setForcedHeight(maxHeight);
  };

  if (error) return <div className={className}>Error loading SVG</div>;
  if (!content) return null;

  return <SvgRendererServer svgContent={content} className={className} forcedHeight={forcedHeight} />;
}
