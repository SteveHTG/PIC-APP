import { useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";

const DISMISS_KEY = "pic_install_dismissed";

// Dismissible install banner shown on the map screen. Triggers the native
// install dialog on Chrome/Edge/Android; shows Add-to-Home-Screen steps on
// iOS Safari. Hidden if already installed or previously dismissed.
export default function InstallPrompt() {
  const { installed, canInstall, isIOS, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1",
  );
  const [showIosHelp, setShowIosHelp] = useState(false);

  // Nothing to offer, already installed, or user dismissed it.
  if (installed || dismissed) return null;
  if (!canInstall && !isIOS) return null;

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  async function handleInstall() {
    if (canInstall) {
      const outcome = await promptInstall();
      if (outcome === "accepted") dismiss();
    } else if (isIOS) {
      setShowIosHelp((v) => !v);
    }
  }

  return (
    <div className="absolute bottom-28 left-0 right-0 z-30 px-4">
      <div className="mx-auto max-w-md rounded-2xl bg-navy p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src={`${import.meta.env.BASE_URL}logo-mark.svg`}
              alt=""
              className="h-full w-full object-contain p-0.5"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              Install this app
            </p>
            <p className="truncate text-[11px] text-white/70">
              Quick home-screen access
            </p>
          </div>
          <button
            onClick={handleInstall}
            className="shrink-0 rounded-xl bg-brand-green px-3.5 py-2 text-sm font-semibold text-white transition active:scale-95"
          >
            {isIOS ? "How to" : "Install"}
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="shrink-0 px-1 text-white/40"
          >
            ✕
          </button>
        </div>

        {isIOS && showIosHelp && (
          <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/80">
            Tap the Share button{" "}
            <ShareIcon className="inline h-3.5 w-3.5 -translate-y-0.5" /> in
            Safari, then choose <span className="font-semibold">Add to Home
            Screen</span>.
          </p>
        )}
      </div>
    </div>
  );
}

function ShareIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5" />
    </svg>
  );
}
