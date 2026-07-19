import {
  getBatteryStatus,
  getReturnStatus,
  STATUS_STYLES,
} from "../lib/availability";
import { getDirectionsUrl } from "../lib/navigation";

// Bottom sheet shown when a station pin is tapped.
export default function StationSheet({ station, onClose }) {
  if (!station) return null;

  const battery = getBatteryStatus(station.availableBatteries ?? 0);
  const returns = getReturnStatus(station.emptySlots ?? 0);

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

          {/* Availability — the two rental-model counts */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <StatCard
              value={station.availableBatteries ?? 0}
              caption="Batteries to grab"
              status={battery}
            />
            <StatCard
              value={station.emptySlots ?? 0}
              caption="Slots to return"
              status={returns}
            />
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

function StatCard({ value, caption, status }) {
  const styles = STATUS_STYLES[status.level];
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-bold ${styles.text}`}>{value}</span>
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      </div>
      <p className="mt-1 text-xs font-medium text-navy-400">{caption}</p>
    </div>
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
