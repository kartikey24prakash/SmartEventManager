import { Link } from "react-router";

import PublicLayout from "../components/common/PublicLayout";

const featureCards = [
  {
    title: "Coordinator Workspace",
    description:
      "Run setup, attendance, winners, and certificates from one structured operations flow.",
    tone: "from-violet-600 to-indigo-600",
  },
  {
    title: "Participant Experience",
    description:
      "Discover events, manage registrations, form teams, and keep certificates organized in one place.",
    tone: "from-cyan-600 to-blue-600",
  },
  {
    title: "Certificate Engine",
    description:
      "Generate participation and achievement certificates directly from verified event outcomes.",
    tone: "from-amber-500 to-orange-600",
  },
];

const workflow = [
  {
    step: "01",
    title: "Set up an event",
    description: "Configure type, dates, rules, venue, and participation model.",
  },
  {
    step: "02",
    title: "Run live operations",
    description: "Track registrations, mark attendance, validate teams, and manage workflow.",
  },
  {
    step: "03",
    title: "Declare results",
    description: "Assign winners, complete the event, and generate certificates cleanly.",
  },
];

const statCards = [
  { label: "Unified Workflows", value: "3 roles" },
  { label: "Certificate Types", value: "2 outputs" },
  { label: "Operations Surface", value: "1 system" },
];

export default function HomePage() {
  return (
    <PublicLayout
      badge="Academic Event Operations"
      title="One consistent system for academic events."
      subtitle="SMART Event Manager brings together registrations, coordination, analytics, winners, and certificates in a cleaner workflow for institutions, coordinators, and participants."
      actions={
        <>
          <Link
            to="/register"
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700"
          >
            Register as Participant
          </Link>
          <Link
            to="/login"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
          >
            Open Dashboard
          </Link>
        </>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.24em] text-violet-600">
                Product Snapshot
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Built for real event flow</h2>
            </div>
            <div className="rounded-2xl bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Live System
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {statCards.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="text-3xl font-black text-slate-950">{item.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-900 p-6 text-white">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">
              Why it feels different
            </div>
            <div className="mt-3 text-2xl font-bold">Less friction, more operational clarity.</div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
              Instead of splitting event work across disconnected tools, SMART keeps setup,
              execution, outcomes, and certificates inside one coordinated product.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div
                className={`inline-flex rounded-2xl bg-gradient-to-r px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white ${card.tone}`}
              >
                Feature
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-950">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-2xl">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-violet-600">
            Workflow
          </div>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">A cleaner event lifecycle</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The product should feel the same from first visit to final certificate. This structure
            keeps that journey simple.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {workflow.map((item) => (
            <div key={item.step} className="rounded-[1.75rem] bg-slate-50 p-5">
              <div className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
                {item.step}
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
            For Participants
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Discover, join, and download.</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <li>Browse live academic, technical, sports, and cultural events.</li>
            <li>Register individually or create teams when events require it.</li>
            <li>Keep earned certificates organized in one clean dashboard.</li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-violet-600">
            For Coordinators
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Operate events with structure.</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <li>Manage attendance, teams, winners, and lifecycle states in one workspace.</li>
            <li>Use analytics and event summaries to see where action is needed.</li>
            <li>Generate participation and achievement certificates from verified outcomes.</li>
          </ul>
        </div>
      </section>
    </PublicLayout>
  );
}
