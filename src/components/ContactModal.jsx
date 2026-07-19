import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabase/client";
import { APP_CONFIG } from "../config";

// Contact Us overlay: native call/email triggers + a support form that
// writes to the `support_tickets` Supabase table.
export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  // Honeypot field — bots fill it, humans never see it.
  const [trap, setTrap] = useState("");

  if (!open) return null;
  const { contact } = APP_CONFIG;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (trap) return; // silently drop bot submissions
    if (!form.message.trim()) return;
    setState("sending");
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("support_tickets").insert({
          name: form.name,
          email: form.email,
          message: form.message,
          user_agent: navigator.userAgent,
        });
        if (error) throw error;
      } else {
        // Dev / demo mode — no backend yet.
        console.info("[PIC] (demo) support ticket:", form);
        await new Promise((r) => setTimeout(r, 600));
      }
      setState("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("[PIC] ticket submit failed:", err);
      setState("error");
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-navy/30"
      />

      <div className="safe-bottom relative w-full animate-sheet-up">
        <div className="mx-auto max-w-md rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-[var(--shadow-sheet)]">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Contact Us</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-navy-400"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Native triggers */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-white py-3 shadow-[var(--shadow-card)] active:scale-[0.98]"
            >
              <PhoneIcon />
              <span className="text-sm font-semibold text-navy">Call</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-white py-3 shadow-[var(--shadow-card)] active:scale-[0.98]"
            >
              <MailIcon />
              <span className="text-sm font-semibold text-navy">Email</span>
            </a>
          </div>

          {state === "sent" ? (
            <div className="rounded-2xl bg-brand-green-light px-4 py-6 text-center">
              <p className="text-base font-semibold text-brand-green-dark">
                Message sent — thank you!
              </p>
              <p className="mt-1 text-sm text-brand-green-dark/80">
                We'll get back to you shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-navy px-5 py-2 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={update("name")}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
              />
              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={update("email")}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
              />
              <textarea
                placeholder="How can we help?"
                required
                rows={3}
                value={form.message}
                onChange={update("message")}
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
              />
              {/* Honeypot (visually hidden) */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              {state === "error" && (
                <p className="text-sm font-medium text-red-600">
                  Something went wrong. Please try again or call us.
                </p>
              )}

              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full rounded-2xl bg-navy py-3.5 text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-xs text-navy-400">
            {contact.address} · {contact.hours}
          </p>
        </div>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-6 w-6 text-brand-green" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.25 1l-2.2 2.3z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="h-6 w-6 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
