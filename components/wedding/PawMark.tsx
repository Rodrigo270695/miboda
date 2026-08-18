export function PawMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="16.6" rx="4.3" ry="3.5" fill="currentColor" />
      <circle cx="6.1" cy="11.1" r="1.9" fill="currentColor" />
      <circle cx="9.3" cy="7.6" r="1.75" fill="currentColor" />
      <circle cx="14.7" cy="7.6" r="1.75" fill="currentColor" />
      <circle cx="17.9" cy="11.1" r="1.9" fill="currentColor" />
    </svg>
  );
}
