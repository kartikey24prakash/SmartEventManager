export default function AnalyticsDashboard({ overview, loading }) {
  const stats = [
    { label: "Total Events", value: overview?.totalEvents || 0 },
    { label: "Participants", value: overview?.totalParticipants || 0 },
    { label: "Registrations", value: overview?.totalRegistrations || 0 },
    { label: "Teams", value: overview?.totalTeams || 0 },
    { label: "Coordinators", value: overview?.coordinatorCount || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-800 text-lg font-bold">Analytics Overview</h2>
        <p className="text-slate-400 text-sm">
          System-wide statistics across all events
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-0.5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-700 mb-3">Event Status</p>
              <div className="space-y-2">
                {(overview?.eventsByStatus || []).map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-slate-500">{item._id}</span>
                    <span className="font-semibold text-slate-700">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-700 mb-3">
                Coordinator Workload
              </p>
              <div className="space-y-3">
                {(overview?.coordinatorWorkload || []).map((item) => (
                  <div key={item.coordinator._id}>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.coordinator.name}</span>
                      <span className="font-semibold text-slate-700">
                        {item.events.length} events
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {item.totalParticipants} participants across assigned events
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
