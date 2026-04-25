import { Link } from "react-router";

import PublicLayout from "../components/common/PublicLayout";

export default function NotFoundPage() {
  return (
    <PublicLayout
      compact
      badge="404"
      title="That page could not be found."
      subtitle="The route may have changed, the page may have moved, or the address may be incorrect."
      actions={
        <>
          <Link
            to="/"
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700"
          >
            Return Home
          </Link>
          <Link
            to="/login"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
          >
            Go to Login
          </Link>
        </>
      }
    >
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-7xl font-black tracking-[-0.08em] text-slate-200">404</div>
        <div className="mt-4 text-lg font-semibold text-slate-900">
          This destination is outside the current product map.
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Try returning to the homepage or sign in to your dashboard to continue working inside
          the event system.
        </p>
      </div>
    </PublicLayout>
  );
}
