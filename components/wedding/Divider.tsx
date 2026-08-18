import { PawMark } from "@/components/wedding/PawMark";

export function Divider() {
  return (
    <div className="mx-auto my-7 flex w-full max-w-52 items-center gap-3 text-[var(--gold)] opacity-95">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
      <PawMark size={20} />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
    </div>
  );
}
