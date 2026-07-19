// Builds a platform-appropriate "get directions" deep link that opens
// the device's native maps app with the destination pre-filled.

export function getDirectionsUrl(station) {
  const { latitude, longitude } = station.coordinates || {};
  const label = encodeURIComponent(station.name || "Charging station");
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as Mac; fall back on touch support.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // Apple Maps
    return `https://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`;
  }
  // Google Maps universal directions URL (works on Android + web).
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
