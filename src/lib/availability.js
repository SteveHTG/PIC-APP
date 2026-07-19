// Helpers for interpreting station availability into UI states.

/**
 * Rental-model availability. Users care about two things:
 *  - can I GRAB a charged bank here?  (availableBatteries)
 *  - can I RETURN my bank here?       (emptySlots)
 */
export function getBatteryStatus(count) {
  if (count <= 0) return { level: "empty", label: "None available" };
  if (count <= 2) return { level: "low", label: `${count} available` };
  return { level: "good", label: `${count} available` };
}

export function getReturnStatus(emptySlots) {
  if (emptySlots <= 0) return { level: "empty", label: "No return slots" };
  if (emptySlots <= 1) return { level: "low", label: `${emptySlots} return slot` };
  return { level: "good", label: `${emptySlots} return slots` };
}

// Maps a level to brand color classes (kept in one place for consistency).
export const STATUS_STYLES = {
  good: {
    dot: "bg-brand-green",
    text: "text-brand-green-dark",
    chip: "bg-brand-green-light text-brand-green-dark",
  },
  low: {
    dot: "bg-amber",
    text: "text-amber-dark",
    chip: "bg-amber/15 text-amber-dark",
  },
  empty: {
    dot: "bg-slate-400",
    text: "text-slate-500",
    chip: "bg-slate-100 text-slate-500",
  },
};
