import { Link } from "react-router";

export default function PublicLayout({
  badge = "SMART Event Manager",
  title,
  subtitle,
  children,
  actions,
  compact = false,
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(244,247,255,0.94)_38%,_rgba(232,239,251,0.9)_100%)] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.16),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_28%)]" />

      <header className="relative z-10 px-5 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/70 bg-white/75 px-5 py-4 shadow-sm backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-200">
              SEM
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-[0.28em] text-violet-600">
                SMART
              </div>
              <div className="text-xs text-slate-400">Event Manager</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 sm:flex">
            <Link
              to="/login"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-5 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className={`mx-auto ${compact ? "max-w-5xl" : "max-w-7xl"}`}>
          <div className="mb-8 max-w-3xl">
            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-violet-700">
              {badge}
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {subtitle}
              </p>
            ) : null}
            {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
