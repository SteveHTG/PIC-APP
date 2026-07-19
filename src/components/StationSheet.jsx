import { getDirectionsUrl } from "../lib/navigation";

// Bottom sheet shown when a station pin is tapped.
export default function StationSheet({ station, onClose }) {
  if (!station) return null;

  const capacity = station.totalSlots ?? 0;

  return (
    <>
      {/* Scrim */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 z-30 animate-fade-in bg-navy/20"
      />

      <div className="safe-bottom absolute bottom-0 left-0 right-0 z-40 animate-sheet-up">
        <div className="mx-auto max-w-md rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-[var(--shadow-sheet)]">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />

          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className="mb-1 inline-flex items-center rounded-full bg-brand-green-light px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-green-dark">
                P.I.C. Point
              </span>
              <h2 className="text-lg font-bold text-navy">{station.name}</h2>
              <p className="mt-0.5 text-sm text-navy-400">{station.address}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-navy-400"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Station size */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green-light">
              <BatteryBoltIcon className="h-6 w-6 text-brand-green-dark" />
            </div>
            <div>
              <p className="text-xs font-medium text-navy-400">Battery Capacity</p>
              <p className="text-2xl font-bold leading-tight text-navy">
                {capacity}{" "}
                <span className="text-base font-semibold text-navy-400">
                  {capacity === 1 ? "battery" : "batteries"}
                </span>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-navy-600">
            <ClockIcon />
            <span>{station.hours || "Hours unavailable"}</span>
          </div>

          <a
            href={getDirectionsUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-green/30 transition active:scale-[0.98]"
          >
            <NavIcon />
            Navigate
          </a>
        </div>
      </div>
    </>
  );
}

function BatteryBoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <path d="M22 11v2" />
      <path d="M10 9.5 8 12.5h2.2L9.5 15l3-3.2H10l.5-2.3z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function NavIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 2 2 9.5l7.5 3 3 7.5L22 2z" />
    </svg>
  );
}
