import React, { useState } from "react";

// --- Mock Data ---
const mockUser = {
  _id: "u1",
  name: "Arjun Sharma",
  email: "arjun@sms.ac.in",
  institution: "SMS Varanasi",
};

const initialAvailableEvents = [
  {
    _id: "evt001",
    name: "National Hackathon 2026",
    eventType: "technical",
    date: "2026-05-15",
    venue: "Tech Auditorium",
    participationType: "team",
    capacity: 200,
    registered: 143,
    status: "open",
    icon: "⚡",
  },
  {
    _id: "evt002",
    name: "Cultural Fiesta",
    eventType: "cultural",
    date: "2026-04-25",
    venue: "Main Stage",
    participationType: "individual",
    capacity: 300,
    registered: 298,
    status: "open",
    icon: "🎭",
  },
  {
    _id: "evt003",
    name: "Business Plan Competition",
    eventType: "academic",
    date: "2026-06-10",
    venue: "Seminar Hall 2",
    participationType: "team",
    capacity: 100,
    registered: 45,
    status: "open",
    icon: "📚",
  },
  {
    _id: "evt004",
    name: "Athletics Meet 2026",
    eventType: "sports",
    date: "2026-06-20",
    venue: "Sports Ground",
    participationType: "individual",
    capacity: 150,
    registered: 150,
    status: "closed",
    icon: "🏆",
  },
];

const initialMyEvents = [
  {
    _id: "reg1",
    eventId: "evt001",
    eventName: "National Hackathon 2026",
    date: "2026-05-15",
    status: "participated",
    participationType: "team",
    teamName: "ByteForce",
  },
  {
    _id: "reg2",
    eventId: "evt002",
    eventName: "Cultural Fiesta",
    date: "2026-04-25",
    status: "registered",
    participationType: "individual",
  },
];

const initialCertificates = [
  {
    _id: "cert1",
    eventId: "evt001",
    eventName: "National Hackathon 2026",
    type: "participation",
    date: "2026-05-16",
    certNumber: "CERT-NAT-U1-001",
  },
  {
    _id: "cert2",
    eventId: "evt001",
    eventName: "National Hackathon 2026",
    type: "achievement",
    rank: 1,
    date: "2026-05-16",
    certNumber: "CERT-NAT-U1-002",
  },
];

// --- Utilities ---
const STATUS_CONFIG = {
  registered: {
    label: "Registered",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  participated: {
    label: "Participated",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.12)",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.12)",
  },
  open: { label: "Open", color: "#16a34a", bg: "rgba(22,163,74,0.12)" },
  closed: { label: "Closed", color: "#dc2626", bg: "rgba(220,38,38,0.12)" },
};

const RANK_MAP = {
  1: { icon: "🥇", label: "1st Place" },
  2: { icon: "🥈", label: "2nd Place" },
  3: { icon: "🥉", label: "3rd Place" },
};

// ==========================================
// COMPONENT 1: Certificate Preview
// ==========================================
const CertPreview = ({
  type,
  participantName,
  eventName,
  rank,
  certNumber,
}) => (
  <div style={certStyles.preview}>
    <div
      style={{
        ...certStyles.previewInner,
        ...(type === "achievement"
          ? certStyles.achievementBg
          : certStyles.participationBg),
      }}
    >
      <div style={certStyles.watermark}>
        {type === "achievement" ? "🏆" : "📜"}
      </div>
      <div style={certStyles.certTop}>
        CERTIFICATE OF{" "}
        {type === "achievement" ? "ACHIEVEMENT" : "PARTICIPATION"}
      </div>
      <div style={certStyles.certBody}>
        <div style={certStyles.certLine}>This is to certify that</div>
        <div style={certStyles.certName}>{participantName}</div>
        <div style={certStyles.certLine}>
          has successfully {type === "achievement" ? "won" : "participated in"}
        </div>
        <div style={certStyles.certEvent}>{eventName}</div>
        {type === "achievement" && rank && (
          <div style={certStyles.certRank}>
            {RANK_MAP[rank]?.icon} {RANK_MAP[rank]?.label}
          </div>
        )}
      </div>
      <div style={certStyles.certFooter}>
        <div style={certStyles.certSig}>Authorized Signature</div>
        <div>
          <div style={certStyles.certDate}>
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 4 }}>
            ID: {certNumber}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// COMPONENT 2: Event Browser
// ==========================================
const EventBrowser = ({ events, userRegistrations, onEnroll }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || e.eventType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Browse Events</h2>
          <p style={styles.sectionSub}>
            Discover and participate in upcoming events.
          </p>
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.filterGroup}>
          {["all", "technical", "cultural", "academic", "sports"].map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                ...(filter === f ? styles.filterBtnActive : {}),
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {filteredEvents.map((event) => {
          const isEnrolled = userRegistrations.some(
            (r) => r.eventId === event._id && r.status !== "withdrawn",
          );
          const isFull = event.registered >= event.capacity;
          const sc = STATUS_CONFIG[isFull ? "closed" : event.status];

          return (
            <div key={event._id} style={styles.card} className="hover-card">
              <div style={styles.cardTop}>
                <span style={{ fontSize: 24 }}>{event.icon}</span>
                <span
                  style={{
                    ...styles.statusPill,
                    color: sc.color,
                    background: sc.bg,
                  }}
                >
                  {isFull ? "Full" : sc.label}
                </span>
              </div>
              <h3 style={styles.cardTitle}>{event.name}</h3>
              <div style={styles.meta}>
                <span style={styles.metaItem}>
                  📅{" "}
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span style={styles.metaItem}>📍 {event.venue}</span>
                <span style={styles.metaItem}>
                  {event.participationType === "team"
                    ? "👥 Team Event"
                    : "👤 Individual"}
                </span>
              </div>

              <div style={{ marginTop: 16 }}>
                {isEnrolled ? (
                  <button
                    style={{
                      ...styles.actionBtn,
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "1px solid #e2e8f0",
                    }}
                    disabled
                  >
                    ✓ Already Enrolled
                  </button>
                ) : isFull ? (
                  <button
                    style={{
                      ...styles.actionBtn,
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fca5a5",
                    }}
                    disabled
                  >
                    Event Full
                  </button>
                ) : (
                  <button
                    style={styles.actionBtn}
                    className="primary-btn"
                    onClick={() => onEnroll(event)}
                  >
                    Enroll Now →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 3: My Events (Registrations)
// ==========================================
const MyEvents = ({ registrations, onWithdraw }) => {
  if (registrations.length === 0) {
    return (
      <div style={styles.emptyState}>
        <span style={{ fontSize: 40 }}>📭</span>
        <h3>No active registrations</h3>
        <p>You haven't enrolled in any events yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>My Registrations</h2>
          <p style={styles.sectionSub}>
            Track and manage your event participation.
          </p>
        </div>
      </div>

      <div style={styles.listContainer}>
        {registrations.map((reg) => {
          const sc = STATUS_CONFIG[reg.status];
          return (
            <div
              key={reg._id}
              style={styles.listItem}
              className="hover-list-item"
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>
                    {reg.eventName}
                  </h3>
                  <span
                    style={{
                      ...styles.statusPill,
                      color: sc.color,
                      background: sc.bg,
                    }}
                  >
                    {sc.label}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  <span>
                    📅{" "}
                    {new Date(reg.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    {reg.participationType === "team"
                      ? `👥 Team: ${reg.teamName}`
                      : "👤 Individual"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {reg.participationType === "team" &&
                  reg.status !== "withdrawn" && (
                    <button style={styles.outlineBtn} className="hover-outline">
                      Manage Team
                    </button>
                  )}
                {reg.status === "registered" && (
                  <button
                    style={{
                      ...styles.outlineBtn,
                      color: "#dc2626",
                      borderColor: "#fca5a5",
                    }}
                    className="hover-danger"
                    onClick={() => onWithdraw(reg._id)}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 4: My Certificates
// ==========================================
const MyCertificates = ({ certificates, user }) => {
  if (certificates.length === 0) {
    return (
      <div style={styles.emptyState}>
        <span style={{ fontSize: 40 }}>🎓</span>
        <h3>No certificates yet</h3>
        <p>Participate in events to earn certificates.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>My Certificates</h2>
          <p style={styles.sectionSub}>View and download your achievements.</p>
        </div>
      </div>

      <div style={styles.grid}>
        {certificates.map((cert) => (
          <div key={cert._id} style={styles.card} className="hover-card">
            <CertPreview
              type={cert.type}
              participantName={user.name}
              eventName={cert.eventName}
              rank={cert.rank}
              certNumber={cert.certNumber}
            />
            <button
              style={{ ...styles.actionBtn, marginTop: 12 }}
              className="primary-btn"
            >
              ⬇ Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: Participant Dashboard
// ==========================================
export default function ParticipantDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [user] = useState(mockUser);
  const [events] = useState(initialAvailableEvents);
  const [registrations, setRegistrations] = useState(initialMyEvents);
  const [certificates] = useState(initialCertificates);

  // --- Handlers ---
  const handleEnroll = (event) => {
    // Mock enroll logic
    const newReg = {
      _id: `reg${Date.now()}`,
      eventId: event._id,
      eventName: event.name,
      date: event.date,
      status: "registered",
      participationType: event.participationType,
      teamName:
        event.participationType === "team" ? `${user.name}'s Team` : null,
    };
    setRegistrations([newReg, ...registrations]);
    setActiveView("my-events");
  };

  const handleWithdraw = (regId) => {
    // Mock withdraw logic
    setRegistrations(
      registrations.map((r) =>
        r._id === regId ? { ...r, status: "withdrawn" } : r,
      ),
    );
  };

  // --- Dashboard Overview Content ---
  const renderDashboardOverview = () => {
    const activeRegs = registrations.filter(
      (r) => r.status === "registered" || r.status === "participated",
    ).length;
    const certCount = certificates.length;

    return (
      <div>
        <div style={{ marginBottom: 32 }}>
          <h1 style={styles.title}>Welcome back, {user.name} 👋</h1>
          <p style={styles.subtitle}>{user.institution} • Participant</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div
                style={{
                  ...styles.statIconWrap,
                  color: "#3b82f6",
                  background: "rgba(59,130,246,0.1)",
                }}
              >
                📅
              </div>
            </div>
            <div style={styles.statValue}>{activeRegs}</div>
            <div style={styles.statLabel}>Active Enrollments</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div
                style={{
                  ...styles.statIconWrap,
                  color: "#16a34a",
                  background: "rgba(22,163,74,0.1)",
                }}
              >
                ✅
              </div>
            </div>
            <div style={styles.statValue}>
              {registrations.filter((r) => r.status === "participated").length}
            </div>
            <div style={styles.statLabel}>Events Attended</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div
                style={{
                  ...styles.statIconWrap,
                  color: "#7c3aed",
                  background: "rgba(124, 58, 237, 0.1)",
                }}
              >
                🎓
              </div>
            </div>
            <div style={styles.statValue}>{certCount}</div>
            <div style={styles.statLabel}>Certificates Earned</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {/* Quick Actions Card */}
          <div style={styles.card}>
            <h3 style={{ margin: "0 0 16px", color: "#0f172a" }}>
              Quick Actions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                style={{
                  ...styles.actionBtn,
                  background: "rgba(124, 58, 237, 0.05)",
                  color: "#7c3aed",
                  border: "1px solid rgba(124, 58, 237, 0.2)",
                }}
                onClick={() => setActiveView("browse")}
                className="hover-bg-purple"
              >
                🔍 Browse New Events
              </button>
              <button
                style={{
                  ...styles.actionBtn,
                  background: "rgba(59,130,246,0.05)",
                  color: "#3b82f6",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
                onClick={() => setActiveView("my-events")}
              >
                📋 View My Registrations
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={styles.card}>
            <h3 style={{ margin: "0 0 16px", color: "#0f172a" }}>
              Recent Activity
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {registrations.slice(0, 3).map((r) => (
                <div
                  key={r._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "#334155",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: STATUS_CONFIG[r.status].color,
                    }}
                  />
                  <span style={{ flex: 1 }}>{r.eventName}</span>
                  <span style={{ color: "#64748b" }}>
                    {STATUS_CONFIG[r.status].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render Switch ---
  const renderView = () => {
    switch (activeView) {
      case "browse":
        return (
          <EventBrowser
            events={events}
            userRegistrations={registrations}
            onEnroll={handleEnroll}
          />
        );
      case "my-events":
        return (
          <MyEvents registrations={registrations} onWithdraw={handleWithdraw} />
        );
      case "certificates":
        return <MyCertificates certificates={certificates} user={user} />;
      case "dashboard":
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div style={styles.appContainer}>
      <style>{css}</style>

      {/* Sidebar Navigation */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 18 }}>
            Student Portal
          </span>
        </div>

        <div style={styles.navGroup}>
          <div style={styles.navLabel}>MENU</div>
          {[
            { id: "dashboard", icon: "🏠", label: "Dashboard" },
            { id: "browse", icon: "🔍", label: "Browse Events" },
            { id: "my-events", icon: "📋", label: "My Registrations" },
            { id: "certificates", icon: "🏆", label: "My Certificates" },
          ].map((nav) => (
            <button
              key={nav.id}
              style={{
                ...styles.navItem,
                ...(activeView === nav.id ? styles.navItemActive : {}),
              }}
              onClick={() => setActiveView(nav.id)}
            >
              <span>{nav.icon}</span> {nav.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={styles.mainContentArea}>
        <div style={styles.contentWrapper}>{renderView()}</div>
      </main>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    color: "#334155",
  },
  sidebar: {
    width: "250px",
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
    padding: "0 10px",
  },
  navGroup: { marginBottom: 30 },
  navLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: 700,
    letterSpacing: "0.08em",
    marginBottom: 12,
    padding: "0 10px",
  },
  navItem: {
    width: "100%",
    background: "transparent",
    border: "none",
    padding: "12px 14px",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#475569",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    marginBottom: 4,
  },
  navItemActive: {
    background: "rgba(124, 58, 237, 0.1)",
    color: "#7c3aed",
  },
  mainContentArea: {
    flex: 1,
    overflowY: "auto",
    height: "100vh",
  },
  contentWrapper: {
    padding: "40px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  subtitle: { margin: "6px 0 0", fontSize: 15, color: "#64748b" },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  sectionTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" },
  sectionSub: { margin: "4px 0 0", fontSize: 14, color: "#64748b" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 20,
  },
  statTop: { marginBottom: 12 },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 4,
  },
  statLabel: { fontSize: 13, color: "#64748b", fontWeight: 600 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 24,
    transition: "all 0.2s",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusPill: {
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  cardTitle: {
    margin: "0 0 12px",
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
  },
  meta: { display: "flex", flexDirection: "column", gap: 6 },
  metaItem: { fontSize: 13, color: "#64748b" },
  actionBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
  },
  filterBar: { display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" },
  searchWrap: { position: "relative", flex: 1, minWidth: 250 },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
  },
  searchInput: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "11px 14px 11px 38px",
    color: "#334155",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  filterGroup: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterBtn: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "8px 16px",
    color: "#64748b",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterBtnActive: {
    background: "rgba(124, 58, 237, 0.08)",
    border: "1px solid rgba(124, 58, 237, 0.3)",
    color: "#7c3aed",
    fontWeight: 600,
  },
  listContainer: { display: "flex", flexDirection: "column", gap: 12 },
  listItem: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    transition: "all 0.2s",
  },
  outlineBtn: {
    background: "transparent",
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    padding: "8px 16px",
    color: "#475569",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: 14,
    color: "#64748b",
  },
};

const certStyles = {
  preview: { width: "100%" },
  previewInner: {
    borderRadius: 8,
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "2px solid",
  },
  participationBg: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderColor: "#e2e8f0",
  },
  achievementBg: {
    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    borderColor: "#fde68a",
  },
  watermark: {
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 48,
    opacity: 0.08,
  },
  certTop: {
    fontSize: 9,
    letterSpacing: "0.15em",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  certBody: {
    textAlign: "center",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  certLine: { fontSize: 11, color: "#64748b" },
  certName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.5px",
    margin: "4px 0",
  },
  certEvent: { fontSize: 13, fontWeight: 600, color: "#7c3aed" },
  certRank: { fontSize: 14, fontWeight: 700, color: "#d97706", marginTop: 4 },
  certFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
    paddingTop: 10,
    borderTop: "1px solid #e2e8f0",
  },
  certSig: { fontSize: 10, color: "#94a3b8", fontStyle: "italic" },
  certDate: { fontSize: 10, color: "#94a3b8", textAlign: "right" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
  
  .primary-btn {
    background: #7c3aed !important;
    color: #ffffff !important;
  }
  .primary-btn:hover:not(:disabled) {
    background: #6d28d9 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
  }
  .hover-card:hover {
    border-color: #7c3aed44 !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.04);
    transform: translateY(-2px);
  }
  .hover-list-item:hover {
    border-color: #7c3aed44 !important;
    background: #f8fafc !important;
  }
  .hover-outline:hover {
    border-color: #7c3aed88 !important;
    color: #7c3aed !important;
    background: rgba(124, 58, 237, 0.05) !important;
  }
  .hover-danger:hover {
    background: #fee2e2 !important;
  }
  .hover-bg-purple:hover {
    background: rgba(124, 58, 237, 0.1) !important;
  }
  .navItem:hover:not(.navItemActive) {
    background: #f1f5f9 !important;
  }
  input:focus {
    border-color: #7c3aed88 !important;
  }

  @media (max-width: 768px) {
    .appContainer { flex-direction: column !important; }
    .sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid #e2e8f0 !important; }
    .contentWrapper { padding: 20px !important; }
  }
`;
