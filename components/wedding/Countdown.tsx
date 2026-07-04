"use client";

import { useEffect, useState } from "react";

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

function calculateCountdown(targetDate: string): CountdownValue {
  const target = new Date(targetDate).getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: true,
    };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    finished: false,
  };
}

function CountdownItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-2xl border border-[var(--line)] bg-white/80 px-3.5 py-4 shadow-[0_12px_30px_rgba(30,95,150,0.08)]">
      <div className="font-serif text-4xl leading-none text-[var(--blue)]">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--pale)]">
        {label}
      </div>
    </div>
  );
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const [countdown, setCountdown] = useState<CountdownValue | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(calculateCountdown(targetDate));
    };

    const timeout = window.setTimeout(updateCountdown, 0);
    const interval = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [targetDate]);

  if (!countdown) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        <CountdownItem label="Dias" value={0} />
        <CountdownItem label="Horas" value={0} />
        <CountdownItem label="Min" value={0} />
        <CountdownItem label="Seg" value={0} />
      </div>
    );
  }

  if (countdown.finished) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-white/80 px-8 py-5 font-serif text-2xl text-[var(--blue)]">
        Hoy es el gran dia
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <CountdownItem label="Dias" value={countdown.days} />
      <CountdownItem label="Horas" value={countdown.hours} />
      <CountdownItem label="Min" value={countdown.minutes} />
      <CountdownItem label="Seg" value={countdown.seconds} />
    </div>
  );
}
