import { useState } from "react";

const inputCls =
  "w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
const labelCls =
  "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
const EVENT_TYPES = ["technical", "cultural", "sports", "academic", "other"];
const PARTICIPATION_TYPES = ["individual", "team"];

export default function EventForm({ event = null, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: event?.name || "",
    description: event?.description || "",
    eventType: event?.eventType || "",
    participationType: event?.participationType || "individual",
    registrationStartDate: event?.registrationStartDate || "",
    registrationEndDate: event?.registrationEndDate || "",
    eventDate: event?.eventDate || "",
    venue: event?.venue || "",
    maxParticipants: event?.maxParticipants || "",
    rules: event?.rules || "",
    prizes: event?.prizes?.join(", ") || "",
    minTeamSize: event?.teamConfig?.minTeamSize || 2,
    maxTeamSize: event?.teamConfig?.maxTeamSize || 5,
    genderRequirement: event?.teamConfig?.genderRequirement || "none",
    allowCrossInstitution: event?.teamConfig?.allowCrossInstitution || false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Event name is required";
    if (!form.eventType) e.eventType = "Select an event type";
    if (!form.eventDate) e.eventDate = "Event date is required";
    if (!form.venue.trim()) e.venue = "Venue is required";
    if (
      form.registrationStartDate &&
      form.registrationEndDate &&
      form.registrationStartDate > form.registrationEndDate
    )
      e.registrationEndDate = "End date must be after start date";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onSubmit?.({
      ...form,
      prizes: form.prizes
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-1 bg-linear-to-r from-blue-500 to-indigo-500" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-800 text-lg font-bold">
              {event ? "Edit Event" : "Create New Event"}
            </h2>
            <p className="text-slate-400 text-sm">
              Fill in the details below to {event ? "update" : "publish"} the
              event
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${event ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}
          >
            {event ? "✏️ Editing" : "✨ New"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelCls}>Event Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Annual Hackathon 2026"
                className={`${inputCls} ${errors.name ? "border-red-300" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                placeholder="Describe the event..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Event Type *</label>
              <select
                value={form.eventType}
                onChange={set("eventType")}
                className={`${inputCls} ${errors.eventType ? "border-red-300" : ""}`}
              >
                <option value="">Select type...</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Participation Type</label>
              <div className="flex gap-2 mt-1">
                {PARTICIPATION_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, participationType: t }))
                    }
                    className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${form.participationType === t ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300"}`}
                  >
                    {t === "individual" ? "👤" : "👥"}{" "}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Team Config */}
          {form.participationType === "team" && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
              <p className="text-blue-700 text-xs font-bold uppercase tracking-wider">
                Team Configuration
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Min Team Size</label>
                  <input
                    type="number"
                    value={form.minTeamSize}
                    onChange={set("minTeamSize")}
                    min={2}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Max Team Size</label>
                  <input
                    type="number"
                    value={form.maxTeamSize}
                    onChange={set("maxTeamSize")}
                    min={2}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Gender Requirement</label>
                <select
                  value={form.genderRequirement}
                  onChange={set("genderRequirement")}
                  className={inputCls}
                >
                  {[
                    "none",
                    "mixed",
                    "at least 1 female",
                    "at least 1 male",
                  ].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allowCrossInstitution}
                  onChange={set("allowCrossInstitution")}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-600">
                  Allow cross-institution teams
                </span>
              </label>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Event Date *</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={set("eventDate")}
                className={`${inputCls} ${errors.eventDate ? "border-red-300" : ""}`}
              />
              {errors.eventDate && (
                <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Reg. Start Date</label>
              <input
                type="date"
                value={form.registrationStartDate}
                onChange={set("registrationStartDate")}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Reg. End Date</label>
              <input
                type="date"
                value={form.registrationEndDate}
                onChange={set("registrationEndDate")}
                className={`${inputCls} ${errors.registrationEndDate ? "border-red-300" : ""}`}
              />
              {errors.registrationEndDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.registrationEndDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Venue *</label>
              <input
                type="text"
                value={form.venue}
                onChange={set("venue")}
                placeholder="e.g. Main Auditorium"
                className={`${inputCls} ${errors.venue ? "border-red-300" : ""}`}
              />
              {errors.venue && (
                <p className="text-red-500 text-xs mt-1">{errors.venue}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Max Participants</label>
              <input
                type="number"
                value={form.maxParticipants}
                onChange={set("maxParticipants")}
                placeholder="Leave empty for unlimited"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rules</label>
              <textarea
                value={form.rules}
                onChange={set("rules")}
                rows={3}
                placeholder="Event rules and guidelines..."
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className={labelCls}>Prizes (comma-separated)</label>
              <textarea
                value={form.prizes}
                onChange={set("prizes")}
                rows={3}
                placeholder="1st: ₹5000, 2nd: ₹3000, 3rd: ₹1000"
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>{" "}
                  Saving...
                </>
              ) : (
                <>{event ? "💾 Update Event" : "🚀 Create Event"}</>
              )}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
