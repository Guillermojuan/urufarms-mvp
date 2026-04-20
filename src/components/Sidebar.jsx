import { LayoutDashboard, LogOut, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Proyectos", icon: LayoutDashboard },
];

export default function Sidebar() {
  const { activeView, setActiveView, currentUser, logout, setSelectedProject } = useApp();

  function goToDashboard() {
    setSelectedProject(null);
    setActiveView("dashboard");
  }

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        minHeight: "100vh",
        background: "#4B0082",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          cursor: "pointer",
        }}
        onClick={goToDashboard}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="9" fill="rgba(255,255,255,0.12)" />
            <path d="M8 30 L20 10 L32 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M13 24 L27 24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="10" r="2.5" fill="#FF4500"/>
          </svg>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#fff", letterSpacing: "0.06em" }}>
              URUFARMS
            </div>
            <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", marginTop: "1px" }}>
              POWERED BY BUILDTRUST
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <p style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "0 8px",
          marginBottom: "8px",
        }}>
          Plataforma
        </p>

        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeView === id || activeView === "project";
          return (
            <button
              key={id}
              onClick={goToDashboard}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                width: "100%",
                textAlign: "left",
                border: "none",
                cursor: "pointer",
                background: active ? "rgba(255,255,255,0.15)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
                fontWeight: active ? 600 : 400,
                fontSize: "14px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {label}
              {active && <ChevronRight size={13} style={{ marginLeft: "auto", opacity: 0.6 }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div
        style={{
          margin: "12px",
          padding: "14px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #DC143C, #FF4500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {currentUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.name}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              {currentUser?.role}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fca5a5")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
