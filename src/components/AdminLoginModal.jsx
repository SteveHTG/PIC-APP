import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Quick admin sign-in dialog, reached from the small "Admin" link on the
// map screen. On success, sends the admin straight into /admin (which
// sees the now-active Supabase session and skips its own login screen).
export default function AdminLoginModal({ open, onClose }) {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEmail("");
    setPassword("");
    onClose();
    navigate("/admin");
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-navy/30"
      />

      <div className="safe-bottom relative w-full animate-sheet-up">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-[var(--shadow-sheet)]"
        >
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />

          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Admin Sign In</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-navy-400"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="mb-4 text-sm text-navy-400">
            Sign in to manage P.I.C. Points.
          </p>

          <div className="space-y-2.5">
            <input
              type="email"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
            />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
            />
          </div>

          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            disabled={submitting}
            className="mt-3 w-full rounded-2xl bg-navy py-3.5 text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
