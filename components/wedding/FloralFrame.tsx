const backgroundImage = "/cenicienta.png";

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
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-[640px] bg-[linear-gradient(180deg,rgba(197,216,239,0.28)_0%,rgba(240,245,251,0.12)_35%,rgba(197,216,239,0.35)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-30 mx-auto max-w-[640px] shadow-[inset_0_0_0_1px_rgba(201,178,122,0.35),inset_0_0_70px_rgba(31,51,88,0.08)]" />
    </>
  );
}
