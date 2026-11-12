"use client";

import type { ReactNode } from "react";
import { quoteStore } from "@/lib/quoteStore";
import { siteConfig } from "@/content/siteConfig";
import Button from "./Button";

type Props = {
  variant?: "solid" | "outline" | "dark" | "light";
  size?: "sm" | "md" | "lg";
  prefill?: string;
  className?: string;
  children?: ReactNode;
};

/** Any CTA that opens the "Get a Free Quote" drawer. */
export default function QuoteButton({ variant = "solid", size = "md", prefill, className, children }: Props) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-haspopup="dialog"
      aria-controls="quote-drawer"
      onClick={() => quoteStore.open(prefill)}
    >
      {children ?? siteConfig.cta.quote.label}
    </Button>
  );
}
