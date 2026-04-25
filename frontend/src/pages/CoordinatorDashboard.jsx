import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import AssignedEvents from "../components/coordinator/AssignedEvents";
import CertificateGenerator from "../components/coordinator/CertificateGenerator";
import EventConfiguration from "../components/coordinator/EventConfiguration";
import EventStats from "../components/coordinator/EventStats";
import ParticipantList from "../components/coordinator/ParticipantList";
import TeamList from "../components/coordinator/TeamList";
import WinnerSelection from "../components/coordinator/WinnerSelection";
import DashboardShell from "../components/common/DashboardShell";
import useAuth from "../hooks/useAuth";
import useCoordinatorData from "../hooks/useCoordinatorData";

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "events", label: "My Events" },
  { id: "stats", label: "Analytics" },
  { id: "configuration", label: "Event-Day Control" },
  { id: "participants", label: "Participants" },
  { id: "teams", label: "Teams" },
  { id: "winners", label: "Winners" },
  { id: "certificates", label: "Certificates" },
];

const cardPalette = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
  const { user, loading: authLoading, error: authError, signOut } = useAuth("coordinator");
  const {
    summary,
    events,
    selectedEventId,
    workspace,
    eventAnalytics,
    attendanceAnalytics,
    certificateAnalytics,
    breakdowns,
    registrations,
    teams,
    winners,
    loading,
    eventLoading,
    actionLoading,
    error,
    actions,
  } = useCoordinatorData();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, navigate, user]);

  const selectedEvent = useMemo(() => {
    return workspace?.event || events.find((event) => event._id === selectedEventId) || null;
  }, [events, selectedEventId, workspace]);

  const cards = [
    {
      label: "Assigned Events",
      value: summary?.summary?.assignedEvents || 0,
      sub: `${summary?.summary?.byStatus?.ongoing || 0} ongoing`,
    },
    {
      label: "Participants",
      value: summary?.summary?.totalParticipants || 0,
      sub: `${summary?.summary?.participationRate || 0}% turnout`,
    },
    {
      label: "Certificates",
      value: summary?.summary?.certificatesIssued || 0,
      sub: `${summary?.pendingTasks?.certificateGenerationPending || 0} events pending`,
    },
    {
      label: "Winner Tasks",
      value: summary?.pendingTasks?.winnerDeclarationsPending || 0,
      sub: `${summary?.pendingTasks?.incompleteEvents || 0} incomplete events`,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.name || "Coordinator"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your assigned events, live participation, winners, and certificates.
          </p>
        </div>
        {selectedEvent ? (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700">
            Active Event: <span className="font-semibold">{selectedEvent.name}</span>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={`rounded-3xl bg-gradient-to-br ${cardPalette[index]} p-5 text-white shadow-lg`}
          >
            <div className="text-sm font-medium text-white/80">{card.label}</div>
            <div className="mt-3 text-4xl font-black">{card.value}</div>
            <div className="mt-2 text-sm text-white/80">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-slate-900">Assigned Event Snapshot</div>
              <div className="text-sm text-slate-500">Choose an event and jump into event-day control.</div>
            </div>
            <button
              type="button"
              onClick={() => setActiveView("events")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
            >
              View all
            </button>
          </div>
          <AssignedEvents
            events={events.slice(0, 4)}
            selectedEventId={selectedEventId}
            loading={loading}
            onSelectEvent={async (eventId) => {
              await actions.selectEvent(eventId);
              setActiveView("configuration");
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-xl font-bold text-slate-900">Pending Tasks</div>
            {(workspace?.tasks || []).length === 0 ? (
              <div className="text-sm text-slate-500">No pending tasks right now.</div>
            ) : (
              <div className="space-y-3">
                {workspace.tasks.map((task) => (
                  <div key={task.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <div className="font-semibold text-slate-900">{task.label}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                      Priority: {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-xl font-bold text-slate-900">Quick Actions</div>
            <div className="grid gap-3">
              {[
                { label: "Mark Event Ongoing", onClick: () => actions.updateEventStatus("ongoing") },
                { label: "Open Participants", onClick: () => setActiveView("participants") },
                { label: "Declare Winners", onClick: () => setActiveView("winners") },
                { label: "Generate Certificates", onClick: () => setActiveView("certificates") },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  disabled={actionLoading || !selectedEvent}
                  onClick={action.onClick}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (activeView) {
      case "events":
        return (
          <AssignedEvents
            events={events}
            selectedEventId={selectedEventId}
            loading={loading}
            onSelectEvent={actions.selectEvent}
          />
        );
      case "stats":
        return (
          <EventStats
            event={selectedEvent}
            analytics={eventAnalytics}
            attendanceAnalytics={attendanceAnalytics}
            certificateAnalytics={certificateAnalytics}
            breakdowns={breakdowns}
            loading={eventLoading}
          />
        );
      case "configuration":
        return (
          <EventConfiguration
            event={selectedEvent}
            workspace={workspace}
            onUpdateStatus={actions.updateEventStatus}
            actionLoading={actionLoading}
          />
        );
      case "participants":
        return (
          <ParticipantList
            eventName={selectedEvent?.name}
            registrations={registrations}
            onStatusChange={actions.updateRegistrationStatus}
            onRemove={actions.removeParticipant}
            actionLoading={actionLoading}
          />
        );
      case "teams":
        return (
          <TeamList
            eventName={selectedEvent?.name}
            teams={teams}
            onStatusChange={actions.updateTeamStatus}
            onRemove={actions.removeTeam}
            actionLoading={actionLoading}
          />
        );
      case "winners":
        return (
          <WinnerSelection
            eventName={selectedEvent?.name}
            participationType={selectedEvent?.participationType}
            registrations={registrations}
            teams={teams}
            winners={winners}
            onAssignWinner={(entityId, rank) => {
              if (selectedEvent?.participationType === "team") {
                return actions.markTeamWinner(entityId, rank);
              }
              return actions.markParticipantWinner(entityId, rank);
            }}
            onClearWinner={(entityId) => {
              if (selectedEvent?.participationType === "team") {
                return actions.clearTeamWinner(entityId);
              }
              return actions.clearParticipantWinner(entityId);
            }}
            actionLoading={actionLoading}
          />
        );
      case "certificates":
        return (
          <CertificateGenerator
            eventName={selectedEvent?.name}
            certificateAnalytics={certificateAnalytics}
            onGenerateParticipation={actions.generateParticipationCertificates}
            onGenerateAchievement={actions.generateAchievementCertificates}
            actionLoading={actionLoading}
          />
        );
      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        Loading coordinator workspace...
      </div>
    );
  }

  return (
    <DashboardShell
      role="coordinator"
      roleLabel="Coordinator"
      roleCaption="Operations Workspace"
      title={selectedEvent?.name || "Select an assigned event"}
      subtitle="Run live event operations, attendance, winners, and certificates from one coordinated workspace."
      navItems={navItems}
      activeId={activeView}
      onSelect={setActiveView}
      user={user}
      error={error || authError}
      onLogout={handleLogout}
      headerBadge={selectedEvent ? `Active event: ${selectedEvent.status}` : "No event selected"}
    >
      {renderView()}
    </DashboardShell>
  );
}
