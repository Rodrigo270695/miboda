export function Divider() {
  return (
    <div className="mx-auto my-7 flex w-full max-w-52 items-center gap-3 text-[var(--blue-soft)] opacity-90">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--blue-soft)] to-transparent" />
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.8-10-9.6C.5 7.8 2.8 4 6.6 4 9 4 11 5.6 12 7.4 13 5.6 15 4 17.4 4c3.8 0 6.1 3.8 4.6 7.4C19.5 16.2 12 21 12 21z"
          fill="currentColor"
        />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--blue-soft)] to-transparent" />
    </div>
  );
}
