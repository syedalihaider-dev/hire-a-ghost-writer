import Link from "next/link";
import type { ComponentProps } from "react";
import { builtRoutes } from "@/config/routes";

type Props = ComponentProps<typeof Link> & { href: string };

/** next/link that only prefetches routes this app actually serves. */
export default function AppLink({ href, prefetch, ...rest }: Props) {
  const path = href.split(/[?#]/)[0];
  return <Link href={href} prefetch={prefetch ?? (builtRoutes.has(path) ? undefined : false)} {...rest} />;
}
