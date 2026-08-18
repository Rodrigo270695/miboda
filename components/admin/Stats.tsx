export function StatCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: number | string;
  detail?: string;
  tone?: "default" | "blue" | "green" | "amber" | "slate";
}) {
  const toneClassName = {
    default: "border-[rgba(201,178,122,0.28)] bg-white/92 text-[var(--ink)] ring-[rgba(143,168,212,0.28)]",
    blue: "border-[rgba(143,168,212,0.45)] bg-[rgba(240,245,251,0.95)] text-[var(--ink)] ring-[rgba(143,168,212,0.35)]",
    green: "border-emerald-100 bg-emerald-50/90 text-emerald-950 ring-emerald-100",
    amber: "border-amber-100 bg-amber-50/90 text-amber-950 ring-amber-100",
    slate: "border-[rgba(194,24,91,0.35)] bg-[linear-gradient(135deg,#c2185b,#d81b60)] text-white ring-[rgba(216,27,96,0.45)]",
  }[tone];
  const dotClassName = {
    default: "bg-[var(--gold)]",
    blue: "bg-[var(--blue-soft)]",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    slate: "bg-[var(--gold)]",
  }[tone];

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-3 shadow-[0_12px_32px_rgba(31,51,88,0.07)] ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(31,51,88,0.11)] sm:p-4 ${toneClassName}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${tone === "slate" ? "text-white/70" : "text-[var(--pale)]"}`}>
          {label}
        </p>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full shadow-sm ${dotClassName}`} />
      </div>
      <p className="mt-1 font-serif text-2xl font-semibold tracking-wide sm:text-3xl">
        {value}
      </p>
      {detail ? (
        <p className={`mt-1 text-[11px] leading-4 ${tone === "slate" ? "text-white/70" : "text-[var(--pale)]"}`}>
          {detail}
        </p>
      ) : null}
    </div>
  );
}
