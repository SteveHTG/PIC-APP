import { useEffect, useState } from "react";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    window.navigator.standalone === true
  );
}

function detectIOS() {
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ reports as Mac
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  return iOS && isSafari;
}

/**
 * PWA install state.
 *  - canInstall: the browser fired `beforeinstallprompt` (Chrome/Edge/Android
 *    on phone or desktop) — we can trigger the native install dialog.
 *  - isIOS: iOS Safari, which has no programmatic install — show Add to Home
 *    Screen instructions instead.
 *  - installed: already running as an installed app — hide the prompt.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(
    typeof window !== "undefined" ? isStandalone() : false,
  );

  useEffect(() => {
    function onBeforeInstall(e) {
      // Stop the browser's default mini-infobar so we can use our own button.
      e.preventDefault();
      setDeferredPrompt(e);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return null;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    // A prompt can only be used once.
    setDeferredPrompt(null);
    return outcome; // "accepted" | "dismissed"
  }

  return {
    installed,
    canInstall: !!deferredPrompt,
    isIOS: detectIOS(),
    promptInstall,
  };
}
