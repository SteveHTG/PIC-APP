// Bottom tab bar. "Map" is the primary screen; "Locate" recenters on the
// user; "Contact" opens the Contact Us dialog.
export default function BottomNav({ onLocate, onContact, locating }) {
  return (
    <nav className="safe-bottom pointer-events-none absolute bottom-0 left-0 right-0 z-20 px-4 pb-3">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-around rounded-2xl bg-white/95 px-2 py-1.5 shadow-[var(--shadow-card)] backdrop-blur">
        <TabButton label="Map" active onClick={() => {}}>
          <MapIcon />
        </TabButton>

        <div className="mx-1 -mt-6 flex flex-col items-center">
          <button
            onClick={onLocate}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-lg shadow-brand-green/30 transition active:scale-95"
            aria-label="Locate me — show P.I.C. Points near you"
          >
            {locating ? <Spinner /> : <LocateIcon />}
          </button>
          <span className="mt-0.5 text-[11px] font-semibold text-brand-green-dark">
            {locating ? "Locating…" : "Near Me"}
          </span>
        </div>

        <TabButton label="Contact" onClick={onContact}>
          <ChatIcon />
        </TabButton>
      </div>
    </nav>
  );
}

function TabButton({ label, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition ${
        active ? "text-navy" : "text-navy-400"
      }`}
    >
      {children}
      {label}
    </button>
  );
}

const iconCls = "h-5 w-5";
function MapIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
function LocateIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
