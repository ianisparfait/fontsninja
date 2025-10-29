import { type ReactNode, type JSX } from "react";

import parse, { Element, domToReact, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";

interface Props {
  svgContent?: string | null;
  className?: string;
  // optional: force a computed height (px or CSS value)
  forcedHeight?: string | number | null;
}

function transformSvg(
  html: string,
  className?: string,
  forcedHeight?: string | number | null,
): string | JSX.Element | JSX.Element[] {
  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.tagName.toLowerCase() === "svg") {
        const attribs = domNode.attribs || {};
        const existingClass = attribs.class || "";
        const combinedClass = `${existingClass} ${className || ""}`.trim();

        // keep all attributes except class (we apply className prop)
        const safeAttribs = Object.fromEntries(Object.entries(attribs).filter(([k]) => k !== "class"));

        // optionally inject a height style if forcedHeight is provided
        const style = forcedHeight
          ? { ...(safeAttribs.style ? { style: safeAttribs.style } : {}), height: forcedHeight }
          : undefined;

        return (
          <svg
            {...safeAttribs}
            className={combinedClass || undefined}
            // server-side we don't attempt to execute scripts but must keep attributes
            style={style as any}
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </svg>
        );
      }
      return undefined;
    },
  };

  return parse(html, options);
}

export default function SvgRenderer({ svgContent, className, forcedHeight }: Props): ReactNode | null {
  if (!svgContent) return null;

  // quick guard: should start with <svg
  if (!/^\s*<svg[\s>]/i.test(svgContent)) {
    // avoid throwing in SSR, just return null or a placeholder
    return null;
  }

  // NOTE: server-side sanitation should be done before passing svgContent here.
  // If you render this on server, sanitize upstream with isomorphic-dompurify + jsdom.

  return <>{transformSvg(svgContent, className, forcedHeight)}</>;
}
