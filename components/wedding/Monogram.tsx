import { wedding } from "@/config/wedding";

export function Monogram({ size = "large" }: { size?: "large" | "small" }) {
  const letterSize = size === "large" ? "text-[9.5rem]" : "text-7xl";

  return (
    <div className="flex items-center justify-center leading-none text-[var(--blue)] drop-shadow-[0_12px_28px_rgba(255,255,255,0.7)]">
      <span className={`font-script ${letterSize}`}>{wedding.celebrant.monogram}</span>
    </div>
  );
}
