/** Technical line drawing of our hardcover (3/4 view). Used as the 2D fallback for the 3D book. */
const STROKES = [
  "M170 50 L360 74 L360 318 L170 342 Z",
  "M128 38 L170 50 L170 342 L128 326 Z",
  "M360 74 L378 82 L378 312 L360 318",
  "M170 50 L188 44 L378 70 L378 82",
  "M128 70 L170 82",
  "M128 296 L170 310",
  "M186 72 L344 92 L344 300 L186 320 Z",
  "M194 80 L336 98 L336 294 L194 312 Z",
  "M262 132 C248 124 232 122 218 126 L218 176 C232 172 248 174 262 182 Z",
  "M268 132 C282 124 298 124 312 130 L312 180 C298 176 282 176 268 182 Z",
  "M216 214 L314 222",
  "M206 236 L324 246",
  "M222 258 L308 266",
  "M110 352 C200 372 330 360 400 334",
];

export default function BookLineArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="80 20 360 360" fill="none" aria-hidden="true">
      {STROKES.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i === 8 || i === 9 ? "var(--gold-500)" : "currentColor"}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
