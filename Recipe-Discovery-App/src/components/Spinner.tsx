export function Spinner({ label = 'Gathering ingredients...' }: { label?: string }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner-disc"></div>
      <p className="spinner-label">{label}</p>
    </div>
  );
}