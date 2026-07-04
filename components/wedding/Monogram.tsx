export function Monogram({ size = "large" }: { size?: "large" | "small" }) {
  const letterSize = size === "large" ? "text-[8.5rem]" : "text-7xl";
  const ampersandSize = size === "large" ? "text-[4.6rem]" : "text-4xl";

  return (
    <div className="flex items-center justify-center gap-2 leading-none text-[var(--blue)] drop-shadow-[0_12px_26px_rgba(255,255,255,0.62)]">
      <span className={`font-script ${letterSize}`}>R</span>
      <span
        className={`translate-y-1 font-serif ${ampersandSize} font-medium italic text-[var(--blue-soft)]`}
      >
        &
      </span>
      <span className={`font-script ${letterSize}`}>S</span>
    </div>
  );
}
