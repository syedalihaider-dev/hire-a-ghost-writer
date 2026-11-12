import Link from "@/components/UI/AppLink";
import type { ComponentProps, ReactNode } from "react";
import { ArrowIcon } from "./Icons";
import styles from "./Button.module.css";

type Variant = "solid" | "outline" | "dark" | "light";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Arrow glyph after the label (default true). Pass a node to replace it, false to hide. */
  icon?: ReactNode | boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<ComponentProps<"a">, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

/**
 * Agency CTA: uppercase label that rolls on hover (two stacked copies),
 * arrow that nudges, magnetic pull (picked up by the cursor via data-magnetic).
 * Works in Server and Client trees.
 */
export default function Button(props: AsLink | AsButton) {
  const { variant = "solid", size = "md", icon = true, className, children, ...rest } = props;
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");
  const iconNode = icon === true ? <ArrowIcon size={size === "lg" ? 18 : 15} /> : icon || null;

  const inner = (
    <>
      <span className={styles.roll}>
        <span className={styles.rollA}>{children}</span>
        <span className={styles.rollB} aria-hidden="true">
          {children}
        </span>
      </span>
      {iconNode && (
        <span className={styles.icon} aria-hidden="true">
          {iconNode}
        </span>
      )}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchor } = rest as AsLink;
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      return (
        <a href={href} className={cls} data-magnetic {...anchor}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-magnetic {...anchor}>
        {inner}
      </Link>
    );
  }

  const button = rest as Omit<AsButton, keyof Common>;
  return (
    <button type="button" className={cls} data-magnetic {...button}>
      {inner}
    </button>
  );
}

