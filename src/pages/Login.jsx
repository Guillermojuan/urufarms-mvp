import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password);
    if (!ok) setError("Credenciales incorrectas. Intente nuevamente.");
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#FAFAFA",
      }}
    >
      {/* Left decorative panel */}
      <div
        style={{
          width: "420px",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #4B0082 0%, #8A2BE2 55%, #DC143C 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 40px",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div>
          <LogoMark />
        </div>

        {/* Tagline */}
        <div>
          <p
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.25,
              letterSpacing: "-0.5px",
              marginBottom: "16px",
            }}
          >
            Inteligencia de costos para obras que definen el skyline uruguayo.
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            Normalización automática de ofertas · Benchmark Uruguay · Análisis Peras con Peras™
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "32px" }}>
          {[["+120", "Proyectos"], ["94%", "Precisión"], ["11%", "Ahorro prom."]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: "6px",
              letterSpacing: "-0.4px",
            }}
          >
            Iniciar sesión
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "32px" }}>
            Acceda a su plataforma Urufarms
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@empresa.com"
            />
            <Field
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p style={{ fontSize: "13px", color: "#DC143C", background: "#fff0f0", padding: "10px 14px", borderRadius: "8px", border: "1px solid #fecdd3" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #4B0082 0%, #DC143C 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Verificando…" : "Ingresar"}
            </button>
          </form>

          <p style={{ marginTop: "32px", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
            Urufarms · Powered by BuildTrust · Uruguay 2025
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {/* Simple geometric logo mark */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.15)" />
        <path d="M8 30 L20 10 L32 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M13 24 L27 24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="20" cy="10" r="2.5" fill="#FF4500"/>
      </svg>
      <div>
        <div style={{ fontWeight: 700, fontSize: "18px", color: "#fff", letterSpacing: "0.05em" }}>
          URUFARMS
        </div>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", marginTop: "1px" }}>
          POWERED BY BUILDTRUST
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 600,
          color: "#374151",
          marginBottom: "6px",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        {...props}
        required
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1.5px solid #e5e7eb",
          background: "#fff",
          fontSize: "14px",
          color: "#1a1a2e",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#8A2BE2")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      />
    </div>
  );
}
