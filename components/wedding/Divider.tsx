export function Divider() {
  return (
    <div className="mx-auto my-7 flex w-full max-w-52 items-center gap-3 text-[var(--gold)] opacity-95">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5l1.6 4.8h5.1l-4.1 3 1.6 4.9L12 12.8 7.8 15.2l1.6-4.9-4.1-3h5.1L12 2.5z"
          fill="currentColor"
        />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
    </div>
  );
}
