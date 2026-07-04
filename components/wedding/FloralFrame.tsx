const backgroundImage = "/fondo.png";

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
      <div className="pointer-events-none fixed inset-0 z-30 mx-auto max-w-[640px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28),inset_0_0_70px_rgba(20,52,94,0.06)]" />
    </>
  );
}
