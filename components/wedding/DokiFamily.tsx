import Image from "next/image";
import { wedding } from "@/config/wedding";
import { SectionTitle } from "@/components/wedding/SectionTitle";

export function DokiFamily() {
  return (
    <section className="px-10 py-16 text-center">
      <div className="w-full rounded-3xl border border-[rgba(212,175,55,0.4)] bg-white/88 px-5 py-7 shadow-[0_18px_45px_rgba(90,33,69,0.12)]">
        <SectionTitle subtitle="Listos para la gran aventura">
          Familia Oki Doki
        </SectionTitle>
        <div className="relative mx-auto mb-5 overflow-hidden rounded-[1.6rem] border border-[rgba(244,143,177,0.35)] bg-white">
          <Image
            alt="Familia exploradora de Oki Doki"
            className="h-auto w-full bg-white object-contain"
            height={640}
            src="/familia-doki/familia.png"
            width={736}
          />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {wedding.dokiFamily.map((friend) => (
            <article
              key={friend.name}
              className="overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.28)] bg-white p-1.5 shadow-[0_8px_18px_rgba(90,33,69,0.08)]"
            >
              <Image
                alt={friend.name}
                className="h-28 w-full rounded-xl bg-white object-contain sm:h-32"
                height={320}
                src={friend.image}
                width={246}
              />
              <p className="mt-1.5 font-serif text-sm text-[var(--ink)]">{friend.name}</p>
              <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[var(--fuchsia)]">
                {friend.role}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
