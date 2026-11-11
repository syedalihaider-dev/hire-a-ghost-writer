import type { ElementType, ReactNode } from "react";

/**
 * Renders agency-style mixed-emphasis headlines from content markup:
 *   ~light~   → thin weight
 *   *serif*   → small Playfair italic connector
 *   trailing "." or "?" → gold
 * Text stays plain, crawlable HTML.
 */
export function renderRich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let end: ReactNode = null;
  const last = rest.slice(-1);
  if (last === "." || last === "?") {
    rest = rest.slice(0, -1);
    end = (
      <span className="dot" key="dot">
        {last}
      </span>
    );
  }
  const re = /(~[^~]+~|\*[^*]+\*)/g;
  let i = 0;
  let k = 0;
  for (const m of rest.matchAll(re)) {
    if (m.index! > i) out.push(rest.slice(i, m.index));
    const token = m[0];
    const inner = token.slice(1, -1);
    out.push(
      <span key={k++} className={token[0] === "~" ? "w-light" : "w-serif"}>
        {inner}
      </span>,
    );
    i = m.index! + token.length;
  }
  if (i < rest.length) out.push(rest.slice(i));
  if (end) out.push(end);
  return out;
}

/** Plain-text version (for aria-labels, metadata). */
export const plainRich = (text: string) => text.replace(/[~*]/g, "");

type Props = {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  reveal?: boolean;
};

export default function RichTitle({ text, as: Tag = "h2", id, className, reveal = true }: Props) {
  return (
    <Tag id={id} className={["display", className].filter(Boolean).join(" ")} data-reveal={reveal ? "split" : undefined}>
      {renderRich(text)}
    </Tag>
  );
}
