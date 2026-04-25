import { useState } from "react";
import { Link, useNavigate } from "react-router";

import PublicLayout from "../components/common/PublicLayout";
import { registerParticipant } from "../services/authService";

const inputBase =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:bg-white";

const labelBase =
  "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500";

const GENDERS = ["male", "female", "other"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    institution: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!/^\d{10}$/.test(form.contactNumber)) {
      e.contactNumber = "Enter a valid 10-digit mobile number.";
    }
    if (!form.institution.trim()) e.institution = "Institute name is required.";
    if (!form.studentId.trim()) e.studentId = "Student ID is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }
    if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match.";
    }
    if (!form.gender) e.gender = "Please select a gender.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await registerParticipant({
        name: form.name,
        email: form.email,
        password: form.password,
        gender: form.gender,
        institution: form.institution,
        studentId: form.studentId,
        contactNumber: form.contactNumber,
      });
      setSuccess(true);
      setTimeout(() => navigate("/participant", { replace: true }), 1200);
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PublicLayout
        compact
        badge="Account Created"
        title="Your participant account is ready."
        subtitle="Redirecting you to your workspace now."
      >
        <div className="mx-auto max-w-md rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-950">Registration successful</h2>
          <p className="mt-3 text-sm text-slate-500">
            Your participant account has been created successfully.
          </p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout
      compact
      badge="Participant Registration"
      title="Create your participant account."
      subtitle="Join events, manage registrations, build teams, and keep certificates in one clean workspace."
    >
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">
            Account Setup
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Participant registration</h2>
          <p className="mt-2 text-sm text-slate-500">
            Fill in your details to start using the event platform.
          </p>
        </div>

        {errors.form ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {errors.form}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelBase}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Rahul Sharma"
              className={`${inputBase} ${errors.name ? "border-rose-300" : ""}`}
            />
            {errors.name ? <p className="mt-1 text-xs text-rose-500">{errors.name}</p> : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelBase}>Mobile Number</label>
              <input
                type="tel"
                value={form.contactNumber}
                onChange={handleChange("contactNumber")}
                placeholder="9876543210"
                maxLength={10}
                className={`${inputBase} ${errors.contactNumber ? "border-rose-300" : ""}`}
              />
              {errors.contactNumber ? (
                <p className="mt-1 text-xs text-rose-500">{errors.contactNumber}</p>
              ) : null}
            </div>

            <div>
              <label className={labelBase}>Student ID</label>
              <input
                type="text"
                value={form.studentId}
                onChange={handleChange("studentId")}
                placeholder="e.g. 23MCA101"
                className={`${inputBase} ${errors.studentId ? "border-rose-300" : ""}`}
              />
              {errors.studentId ? (
                <p className="mt-1 text-xs text-rose-500">{errors.studentId}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label className={labelBase}>Institute / College Name</label>
            <input
              type="text"
              value={form.institution}
              onChange={handleChange("institution")}
              placeholder="e.g. SMS Varanasi"
              className={`${inputBase} ${errors.institution ? "border-rose-300" : ""}`}
            />
            {errors.institution ? (
              <p className="mt-1 text-xs text-rose-500">{errors.institution}</p>
            ) : null}
          </div>

          <div>
            <label className={labelBase}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="rahul@example.com"
              className={`${inputBase} ${errors.email ? "border-rose-300" : ""}`}
            />
            {errors.email ? <p className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
          </div>

          <div>
            <label className={labelBase}>Gender</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setForm((p) => ({ ...p, gender: g }));
                    setErrors((p) => ({ ...p, gender: undefined }));
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                    form.gender === g
                      ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-200"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender ? <p className="mt-1 text-xs text-rose-500">{errors.gender}</p> : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelBase}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Minimum 6 characters"
                  className={`${inputBase} pr-20 ${errors.password ? "border-rose-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 transition hover:text-violet-600"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password ? <p className="mt-1 text-xs text-rose-500">{errors.password}</p> : null}
            </div>

            <div>
              <label className={labelBase}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Re-enter password"
                  className={`${inputBase} pr-20 ${errors.confirmPassword ? "border-rose-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 transition hover:text-violet-600"
                  tabIndex={-1}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating your account..." : "Create Participant Account"}
          </button>

          <div className="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-violet-600 transition hover:text-violet-700">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}
