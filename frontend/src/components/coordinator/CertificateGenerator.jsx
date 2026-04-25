export default function CertificateGenerator({
  eventName,
  certificateAnalytics,
  onGenerateParticipation,
  onGenerateAchievement,
  actionLoading = false,
}) {
  if (!certificateAnalytics) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
        Select an event to manage certificates.
      </div>
    );
  }

  const cards = [
    {
      label: "Participation Eligible",
      value: certificateAnalytics.summary?.eligible?.participation || 0,
      tone: "text-violet-700",
    },
    {
      label: "Participation Pending",
      value: certificateAnalytics.summary?.pending?.participation || 0,
      tone: "text-amber-700",
    },
    {
      label: "Achievement Eligible",
      value: certificateAnalytics.summary?.eligible?.achievement || 0,
      tone: "text-emerald-700",
    },
    {
      label: "Achievement Pending",
      value: certificateAnalytics.summary?.pending?.achievement || 0,
      tone: "text-rose-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Certificate Generator</h2>
        <p className="text-sm text-slate-500">
          Generate participation and achievement certificates for {eventName}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`text-3xl font-bold ${card.tone}`}>{card.value}</div>
            <div className="mt-2 text-sm font-semibold text-slate-800">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 text-lg font-bold text-slate-900">Participation Certificates</div>
          <p className="mb-4 text-sm text-slate-500">
            Only participants or team members marked as participated are eligible.
          </p>
          <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Generated:{" "}
            <span className="font-semibold text-slate-900">
              {certificateAnalytics.summary?.generated?.participation || 0}
            </span>
            {" · "}
            Pending:{" "}
            <span className="font-semibold text-slate-900">
              {certificateAnalytics.summary?.pending?.participation || 0}
            </span>
          </div>
          <button
            type="button"
            disabled={actionLoading}
            onClick={onGenerateParticipation}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Generate Participation Certificates
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 text-lg font-bold text-slate-900">Achievement Certificates</div>
          <p className="mb-4 text-sm text-slate-500">
            Only 1st, 2nd, and 3rd place winners are eligible.
          </p>
          <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Generated:{" "}
            <span className="font-semibold text-slate-900">
              {certificateAnalytics.summary?.generated?.achievement || 0}
            </span>
            {" · "}
            Pending:{" "}
            <span className="font-semibold text-slate-900">
              {certificateAnalytics.summary?.pending?.achievement || 0}
            </span>
          </div>
          <button
            type="button"
            disabled={actionLoading}
            onClick={onGenerateAchievement}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Generate Achievement Certificates
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 text-lg font-bold text-slate-900">Recent Certificate Activity</div>
        {(certificateAnalytics.recentCertificates || []).length === 0 ? (
          <div className="text-sm text-slate-500">No certificates generated for this event yet.</div>
        ) : (
          <div className="space-y-3">
            {certificateAnalytics.recentCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {certificate.participantId?.name || "Participant"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {certificate.certificateType} · {certificate.certificateNumber}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(certificate.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
