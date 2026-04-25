const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "TBD";

export default function EventConfiguration({
  event,
  workspace,
  onUpdateStatus,
  actionLoading = false,
}) {
  if (!event || !workspace) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
        Select an event to view event-day controls.
      </div>
    );
  }

  const statusButtons = [
    { status: "ongoing", label: "Mark Ongoing", tone: "bg-amber-600 hover:bg-amber-700" },
    { status: "completed", label: "Complete Event", tone: "bg-emerald-600 hover:bg-emerald-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Event-Day Control</h2>
        <p className="text-sm text-slate-500">
          Review event details and move the event through its live lifecycle.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-bold text-slate-900">{event.name}</div>
              <div className="mt-1 text-sm text-slate-500">
                {event.eventType} · {event.participationType}
              </div>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {event.status}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Registration</div>
              <div className="mt-2 text-sm text-slate-700">
                {formatDate(event.registrationStartDate)} to {formatDate(event.registrationEndDate)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Event Date</div>
              <div className="mt-2 text-sm text-slate-700">{formatDate(event.eventDate)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Venue</div>
              <div className="mt-2 text-sm text-slate-700">{event.venue || "TBD"}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Team Rules</div>
              <div className="mt-2 text-sm text-slate-700">
                {event.participationType === "team"
                  ? `${event.teamConfig?.minTeamSize || 1}-${event.teamConfig?.maxTeamSize || 1} members`
                  : "Individual event"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Rules</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              {event.rules || "No extra rules added for this event."}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Prizes</div>
            {event.prizes?.length ? (
              <div className="flex flex-wrap gap-2">
                {event.prizes.map((prize) => (
                  <span
                    key={prize}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
                  >
                    {prize}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No prize tiers configured.</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-bold text-slate-900">Lifecycle Actions</div>
            <div className="space-y-3">
              {statusButtons.map((button) => (
                <button
                  key={button.status}
                  type="button"
                  disabled={actionLoading || event.status === button.status}
                  onClick={() => onUpdateStatus?.(button.status)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${button.tone}`}
                >
                  {button.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Events can only be completed after at least one participant or team is marked as
              participated.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-lg font-bold text-slate-900">Pending Tasks</div>
            {(workspace.tasks || []).length === 0 ? (
              <div className="text-sm text-slate-500">No pending tasks for this event.</div>
            ) : (
              <div className="space-y-3">
                {workspace.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="font-semibold text-slate-900">{task.label}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                      Priority: {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
