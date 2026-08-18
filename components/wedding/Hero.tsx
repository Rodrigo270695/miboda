import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Divider } from "@/components/wedding/Divider";
import { PawMark } from "@/components/wedding/PawMark";

export function Hero({ invitedName }: { invitedName?: string }) {
  const dateLine = [wedding.event.dateLabel, wedding.event.timeLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-10 py-24 text-center">
      <div className="mb-5 inline-flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 text-[var(--gold)]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]" />
          <PawMark size={16} />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]" />
        </div>
        <p className="rounded-full border border-[rgba(212,175,55,0.65)] bg-[rgba(216,27,96,0.88)] px-6 py-2.5 font-script text-3xl leading-none text-white shadow-[0_10px_28px_rgba(216,27,96,0.28)] sm:text-4xl">
          {wedding.copy.eyebrow}
        </p>
        <div className="flex items-center gap-3 text-[var(--gold)]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]" />
          <PawMark size={16} />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]" />
        </div>
      </div>
      <div className="relative mb-2 flex size-44 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_16px_36px_rgba(216,27,96,0.18)] ring-2 ring-[rgba(212,175,55,0.55)]">
        <Image
          alt="Doki original"
          className="h-[88%] w-[88%] object-contain"
          height={320}
          src="/familia-doki/doki-original.png"
          width={246}
        />
      </div>
      <h1 className="mt-1 font-script text-6xl leading-none text-[var(--ink)] drop-shadow-[0_4px_18px_rgba(255,255,255,0.85)] sm:text-7xl">
        {wedding.celebrant.name}
      </h1>
      <p className="mt-3 max-w-sm rounded-2xl border border-[rgba(212,175,55,0.45)] bg-white/94 px-5 py-3 font-serif text-xl font-semibold leading-snug tracking-wide text-[var(--ink)] shadow-[0_12px_28px_rgba(90,33,69,0.14)]">
        Nahia Dariela
        <span className="mt-0.5 block text-[var(--fuchsia)]">Granja Bello</span>
      </p>
      <Divider />
      <p className="max-w-md rounded-3xl border border-[rgba(212,175,55,0.4)] bg-white/88 px-5 py-4 text-lg font-semibold uppercase tracking-[0.18em] text-[var(--fuchsia)] shadow-[0_14px_34px_rgba(90,33,69,0.12)]">
        {dateLine}
      </p>
      {invitedName ? (
        <div className="mt-10 max-w-md rounded-3xl border border-[rgba(212,175,55,0.45)] bg-[rgba(255,245,248,0.92)] px-7 py-6 shadow-[0_24px_60px_rgba(90,33,69,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--fuchsia)]">
            Invitacion especial para
          </p>
          <p className="mt-2 font-serif text-2xl font-semibold tracking-wide text-[var(--ink)]">
            {invitedName}
          </p>
        </div>
      ) : null}
      <a
        href="#detalles"
        className="absolute bottom-24 z-40 rounded-full border border-[rgba(212,175,55,0.5)] bg-[rgba(255,245,248,0.94)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--fuchsia)] shadow-[0_12px_34px_rgba(90,33,69,0.14)] animate-bob"
      >
        Desliza
      </a>
    </section>
  );
}
