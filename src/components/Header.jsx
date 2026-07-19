import { APP_CONFIG } from "../config";

// Top app bar. Compact, branded, with a live/mock data indicator.
export default function Header({ isLive }) {
  return (
    <header className="safe-top absolute top-0 left-0 right-0 z-20 px-4 pt-3">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl bg-white/90 px-4 py-2.5 shadow-[var(--shadow-card)] backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy">
            <BoltIcon className="h-5 w-5 text-brand-green" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-navy">{APP_CONFIG.name}</p>
            <p className="text-[11px] font-medium text-navy-400">
              {APP_CONFIG.tagline}
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isLive
              ? "bg-brand-green-light text-brand-green-dark"
              : "bg-amber/15 text-amber-dark"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isLive ? "bg-brand-green" : "bg-amber"
            }`}
          />
          {isLive ? "Live" : "Demo"}
        </span>
      </div>
    </header>
  );
}

function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4.5 13.5H11l-1 8.5 9.5-12H13l0-8z" />
    </svg>
  );
}
