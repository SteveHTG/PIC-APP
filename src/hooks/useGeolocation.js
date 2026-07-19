import { useCallback, useState } from "react";

/**
 * On-demand geolocation. We do NOT auto-request on load — the map opens
 * on the default region, and the user taps "locate me" to share position.
 * (Better UX + avoids an immediate permission prompt on QR-scan entry.)
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | locating | granted | denied | unavailable
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus("granted");
      },
      (err) => {
        setError(err);
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  return { position, status, error, locate };
}
