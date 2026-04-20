import { useState } from "react";
import { Plus, MapPin, Clock, ChevronRight, X, FolderOpen } from "lucide-react";
import { useApp } from "../context/AppContext";

const STATUS_CONFIG = {
  bidding: { label: "En licitación", color: "#8A2BE2", bg: "rgba(138,43,226,0.1)" },
  analysis: { label: "En análisis", color: "#DC143C", bg: "rgba(220,20,60,0.1)" },
  review: { label: "En revisión", color: "#059669", bg: "rgba(5,150,105,0.1)" },
  closed: { label: "Cerrado", color: "#9ca3af", bg: "rgba(156,163,175,0.1)" },
};

export default function Dashboard() {
  const { projects, addProject, setActiveView, setSelectedProject } = useApp();
  const [showModal, setShowModal] = useState(false);

  function openProject(project) {
    setSelectedProject(project);
    setActiveView("project");
  }

  return (
    <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto", background: "#FAFAFA" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.4px", marginBottom: "4px" }}>
            Proyectos
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Gestión de licitaciones para obras de alta complejidad en Uruguay
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 20px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #4B0082 0%, #DC143C 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(75,0,130,0.3)",
            transition: "opacity 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Nuevo proyecto
        </button>
      </div>

      {/* Project grid */}
      {projects.length === 0 ? (
        <EmptyState onNew={() => setShowModal(true)} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => openProject(project)} />
          ))}
        </div>
      )}

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onAdd={(p) => {
            const created = addProject(p);
            setShowModal(false);
            openProject(created);
          }}
        />
      )}
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.bidding;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "24px",
        border: "1.5px solid #f0f0f5",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#8A2BE2";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(138,43,226,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#f0f0f5";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Status + name */}
      <div>
        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "20px",
            background: status.bg,
            color: status.color,
            marginBottom: "10px",
            letterSpacing: "0.03em",
          }}
        >
          {status.label}
        </span>
        <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>
          {project.name}
        </h3>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>
          <MapPin size={13} style={{ color: "#8A2BE2" }} />
          {project.location}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>
          <Clock size={13} style={{ color: "#8A2BE2" }} />
          Actualizado: {project.lastUpdated}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
          <span style={{ color: "#9ca3af" }}>Análisis completado</span>
          <span style={{ color: "#4B0082", fontWeight: 600 }}>{project.progress}%</span>
        </div>
        <div style={{ height: "4px", background: "#f0f0f5", borderRadius: "4px" }}>
          <div
            style={{
              height: "4px",
              width: `${project.progress}%`,
              borderRadius: "4px",
              background: "linear-gradient(90deg, #8A2BE2, #DC143C)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#8A2BE2" }}>
          Abrir proyecto <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 32px" }}>
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          background: "rgba(138,43,226,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <FolderOpen size={32} style={{ color: "#8A2BE2" }} />
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", marginBottom: "8px" }}>
        Sin proyectos aún
      </h3>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px" }}>
        Cree su primer proyecto para comenzar a analizar ofertas
      </p>
      <button
        onClick={onNew}
        style={{
          padding: "11px 24px",
          borderRadius: "10px",
          border: "none",
          background: "linear-gradient(135deg, #4B0082 0%, #DC143C 100%)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Crear primer proyecto
      </button>
    </div>
  );
}

function NewProjectModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({ name, location });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26,26,46,0.5)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "36px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 24px 64px rgba(75,0,130,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a2e" }}>Nuevo proyecto</h2>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "3px" }}>Complete los datos básicos del proyecto</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <ModalField
            label="Nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Torre Punta Carretas II"
            required
          />
          <ModalField
            label="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Pocitos, Montevideo"
            required
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                color: "#6b7280",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #4B0082 0%, #DC143C 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(75,0,130,0.25)",
              }}
            >
              Crear proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalField({ label, ...props }) {
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
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1.5px solid #e5e7eb",
          background: "#fafafa",
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
