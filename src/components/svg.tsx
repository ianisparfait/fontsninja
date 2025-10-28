"use client";

import { type ReactNode, useEffect, useState } from "react";

import parse, { Element, domToReact, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";

interface SvgRendererProps {
  src?: string;
  svgContent?: string;
  className?: string;
}

const SvgRenderer = ({ src, svgContent, className }: SvgRendererProps): ReactNode | null => {
  const [fetchedSvg, setFetchedSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const transformSvg = (html: string) => {
    const options: HTMLReactParserOptions = {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.tagName.toLowerCase() === "svg") {
          const attribs = domNode.attribs || {};
          const existingClass = attribs.class || "";
          const combinedClass = `${existingClass} ${className || ""}`.trim();

          return (
            <svg
              {...Object.fromEntries(Object.entries(attribs).filter(([key]) => key !== "class"))}
              className={combinedClass}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </svg>
          );
        }
        return undefined;
      },
    };

    return parse(html, options);
  };

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error("error while loading SVG");
          return res.text();
        })
        .then(setFetchedSvg)
        .catch(() => setError(true));
    }
  }, [src]);

  if (svgContent) return <>{transformSvg(svgContent)}</>;
  if (fetchedSvg) return <>{transformSvg(fetchedSvg)}</>;
  if (error) return <div className={className}>Error while loading SVG.</div>;

  return null;
};

export default SvgRenderer;
