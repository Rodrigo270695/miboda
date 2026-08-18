const backgroundImage = "/doki-nahia.png";

export function FloralFrame() {
  return (
    <>
      <div
        aria-hidden="true"
        className="wedding-ambient-bg"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      <div
        aria-hidden="true"
        className="wedding-fixed-bg"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[640px] bg-[linear-gradient(180deg,rgba(255,245,248,0.28)_0%,rgba(255,255,255,0.1)_35%,rgba(252,228,236,0.38)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-30 mx-auto max-w-[640px] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35),inset_0_0_70px_rgba(216,27,96,0.08)]" />
    </>
  );
}
