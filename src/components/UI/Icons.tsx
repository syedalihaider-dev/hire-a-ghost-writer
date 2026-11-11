type IconProps = { className?: string; size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

export function ArrowIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function PhoneIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

export function MailIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function PinIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function PlusIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronIcon({ className, size }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base(size)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** The open-book mark from the brand logo, as a strokeable SVG. */
export function BookMark({ className, size = 48 }: IconProps) {
  return (
    <svg viewBox="0 0 64 48" width={size} height={(size * 48) / 64} className={className} aria-hidden="true" focusable="false">
      <path d="M31 8C24 4 13 3 4 5v36c9-2 20-1 27 3Z" />
      <path d="M33 8c7-4 18-5 27-3v36c-9-2-20-1-27 3Z" />
    </svg>
  );
}
