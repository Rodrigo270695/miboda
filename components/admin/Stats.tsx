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
    default: "border-white/80 bg-white/90 text-slate-950 ring-blue-100/70",
    blue: "border-sky-100 bg-sky-50/90 text-sky-950 ring-sky-100",
    green: "border-emerald-100 bg-emerald-50/90 text-emerald-950 ring-emerald-100",
    amber: "border-amber-100 bg-amber-50/90 text-amber-950 ring-amber-100",
    slate: "border-slate-800 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white ring-blue-900/40",
  }[tone];
  const dotClassName = {
    default: "bg-blue-500",
    blue: "bg-sky-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    slate: "bg-cyan-300",
  }[tone];

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-3 shadow-[0_12px_32px_rgba(15,23,42,0.07)] ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.11)] sm:p-4 ${toneClassName}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${tone === "slate" ? "text-white/70" : "text-slate-500"}`}>
          {label}
        </p>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full shadow-sm ${dotClassName}`} />
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {value}
      </p>
      {detail ? (
        <p className={`mt-1 text-[11px] leading-4 ${tone === "slate" ? "text-white/70" : "text-slate-500"}`}>
          {detail}
        </p>
      ) : null}
    </div>
  );
}
