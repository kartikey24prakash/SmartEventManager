import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";
import CoordinatorAssignment from "../components/admin/CoordinatorAssignment";
import CoordinatorManagement from "../components/admin/CoordinatorManagement";
import EventAnalytics from "../components/admin/EventAnalytics";
import EventForm from "../components/admin/EventForm";
import EventList from "../components/admin/EventList";
import { getCurrentUser, logoutUser } from "../services/authService";
import { getCoordinators, createCoordinator } from "../services/adminService";
import {
  assignCoordinatorToEvent,
  createEvent,
  deleteEvent,
  getEvents,
  removeCoordinatorFromEvent,
  updateEvent,
} from "../services/eventService";
import {
  getAdminEventsReport,
  getOverviewAnalytics,
} from "../services/analyticsService";

const NAV = [
  { id: "events", label: "Events", sub: "Manage events" },
  { id: "coordinators", label: "Coordinators", sub: "Manage staff" },
  { id: "assignment", label: "Assignment", sub: "Assign coordinators" },
  { id: "analytics", label: "Analytics", sub: "System overview" },
  { id: "eventanalytics", label: "Event Analytics", sub: "Per-event stats" },
];

const formatDateInput = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

const mapEventToForm = (event) => ({
  ...event,
  registrationStartDate: formatDateInput(event.registrationStartDate),
  registrationEndDate: formatDateInput(event.registrationEndDate),
  eventDate: formatDateInput(event.eventDate),
});

const buildEventPayload = (form) => {
  const payload = {
    name: form.name,
    description: form.description,
    eventType: form.eventType,
    participationType: form.participationType,
    registrationStartDate: form.registrationStartDate || undefined,
    registrationEndDate: form.registrationEndDate || undefined,
    eventDate: form.eventDate || undefined,
    venue: form.venue,
    maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
    rules: form.rules,
    prizes: form.prizes,
  };

  if (form.participationType === "team") {
    payload.teamConfig = {
      minTeamSize: Number(form.minTeamSize),
      maxTeamSize: Number(form.maxTeamSize),
      genderRequirement: form.genderRequirement,
      allowCrossInstitution: Boolean(form.allowCrossInstitution),
    };
  }

  return payload;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [overview, setOverview] = useState(null);
  const [eventsReport, setEventsReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const workloadMap = useMemo(() => {
    const map = {};
    (overview?.coordinatorWorkload || []).forEach((item) => {
      map[item.coordinator._id] = item.events.length;
    });
    return map;
  }, [overview]);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [{ user }, eventsData, coordinatorsData, overviewData, eventsReportData] =
        await Promise.all([
          getCurrentUser(),
          getEvents(),
          getCoordinators(),
          getOverviewAnalytics(),
          getAdminEventsReport(),
        ]);

      if (user.role !== "admin") {
        navigate("/login", { replace: true });
        return;
      }

      setCurrentUser(user);
      setEvents(eventsData.events || []);
      setCoordinators(coordinatorsData.users || []);
      setOverview(overviewData);
      setEventsReport(eventsReportData.events || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard.");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAdminData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadAdminData]);

  const handleEdit = (event) => {
    setEditEvent(mapEventToForm(event));
    setShowEventForm(true);
  };

  const handleCreate = () => {
    setEditEvent(null);
    setShowEventForm(true);
  };

  const handleFormSubmit = async (data) => {
    setSaving(true);
    setError("");

    try {
      const payload = buildEventPayload(data);
      if (editEvent?._id) {
        await updateEvent(editEvent._id, payload);
      } else {
        await createEvent(payload);
      }
      setShowEventForm(false);
      setEditEvent(null);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    setSaving(true);
    setError("");

    try {
      await deleteEvent(eventId);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCoordinator = async (form) => {
    await createCoordinator({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "coordinator",
      gender: form.gender,
      institution: form.institution,
      coordinatorId: form.coordinatorId,
      contactNumber: form.contactNumber,
    });
    await loadAdminData();
  };

  const handleAssignCoordinator = async (eventId, coordinatorId) => {
    setSaving(true);
    try {
      await assignCoordinatorToEvent(eventId, coordinatorId);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign coordinator.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCoordinator = async (eventId, coordinatorId) => {
    setSaving(true);
    try {
      await removeCoordinatorFromEvent(eventId, coordinatorId);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove coordinator.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const renderContent = () => {
    if (activeTab === "events" && showEventForm) {
      return (
        <EventForm
          event={editEvent}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowEventForm(false);
            setEditEvent(null);
          }}
        />
      );
    }

    switch (activeTab) {
      case "events":
        return (
          <EventList
            events={events}
            loading={loading}
            onEdit={handleEdit}
            onCreate={handleCreate}
            onDelete={handleDeleteEvent}
          />
        );
      case "coordinators":
        return (
          <CoordinatorManagement
            coordinators={coordinators}
            workloadMap={workloadMap}
            onCreateCoordinator={handleCreateCoordinator}
            creating={saving}
          />
        );
      case "assignment":
        return (
          <CoordinatorAssignment
            events={events}
            coordinators={coordinators}
            onAssign={handleAssignCoordinator}
            onRemove={handleRemoveCoordinator}
            saving={saving}
          />
        );
      case "analytics":
        return <AnalyticsDashboard overview={overview} loading={loading} />;
      case "eventanalytics":
        return <EventAnalytics eventsReport={eventsReport} loading={loading} />;
      default:
        return null;
    }
  };

  const currentNav = NAV.find((item) => item.id === activeTab);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <aside
        className={`${sidebarOpen ? "w-60" : "w-16"} shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-sm`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-30-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
            <span className="text-white text-xs font-bold">SEM</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest leading-tight">
                SMART
              </p>
              <p className="text-xs text-slate-400 leading-tight">Event Manager</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowEventForm(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="text-base shrink-0">{item.label.slice(0, 1)}</span>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold leading-tight">{item.label}</p>
                  <p
                    className={`text-xs leading-tight ${
                      activeTab === item.id ? "text-blue-200" : "text-slate-400"
                    }`}
                  >
                    {item.sub}
                  </p>
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {currentUser?.name?.slice(0, 2).toUpperCase() || "AD"}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-700">
                  {currentUser?.name || "Admin"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser?.email || "admin"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-slate-800 font-bold text-base">
                {currentNav?.label}
              </h1>
              <p className="text-slate-400 text-xs">{currentNav?.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
              Admin
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm">
              {error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
