import { APP_CONFIG } from "../config";

// Top app bar. Compact, branded, with a live/mock data indicator.
export default function Header({ isLive, onAdmin }) {
  return (
    <header className="safe-top absolute top-0 left-0 right-0 z-20 px-4 pt-3">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl bg-white/90 px-4 py-2.5 shadow-[var(--shadow-card)] backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-100">
            <img
              src={`${import.meta.env.BASE_URL}logo-mark.svg`}
              alt="Plugged In Charging"
              className="h-full w-full object-contain p-0.5"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-navy">{APP_CONFIG.name}</p>
            <p className="text-[11px] font-medium text-navy-400">
              {APP_CONFIG.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
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
          {onAdmin && (
            <button
              onClick={onAdmin}
              className="px-1 text-[10px] font-medium tracking-wide text-navy/30"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
