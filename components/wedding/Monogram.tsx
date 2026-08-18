import { wedding } from "@/config/wedding";
import { PawMark } from "@/components/wedding/PawMark";

export function Monogram({ size = "large" }: { size?: "large" | "small" }) {
  const letterSize = size === "large" ? "text-[9.5rem]" : "text-7xl";
  const pawSize = size === "large" ? 28 : 18;

  return (
    <div className="relative flex items-center justify-center leading-none text-[var(--fuchsia)] drop-shadow-[0_12px_28px_rgba(255,255,255,0.7)]">
      <span className={`font-script ${letterSize}`}>{wedding.celebrant.monogram}</span>
      <span className="absolute -right-1 top-6 text-[var(--pink)]">
        <PawMark size={pawSize} />
      </span>
    </div>
  );
}
