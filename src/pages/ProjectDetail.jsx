import { useState, useRef } from "react";
import { ChevronLeft, Upload, FileText, X, CheckCircle, Cpu } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { useApp } from "../context/AppContext";

// ── Mock data for charts ──────────────────────────────────────────────────────

const barData = [
  { rubro: "Estructura", vázquez: 318, dasso: 355, buildcorp: 402, mercado: 340 },
  { rubro: "HVAC", vázquez: 138, dasso: 112, buildcorp: 145, mercado: 120 },
  { rubro: "Vidriería", vázquez: 268, dasso: 241, buildcorp: 295, mercado: 250 },
  { rubro: "Cubierta", vázquez: 125, dasso: 148, buildcorp: 119, mercado: 130 },
  { rubro: "Exterior", vázquez: 88, dasso: 72, buildcorp: 95, mercado: 75 },
];

const pieData = [
  { name: "Estructura", value: 34, color: "#4B0082" },
  { name: "Instalaciones", value: 22, color: "#8A2BE2" },
  { name: "Terminaciones", value: 18, color: "#DC143C" },
  { name: "Cubierta", value: 12, color: "#FF4500" },
  { name: "Exterior", value: 8, color: "#c084fc" },
  { name: "Otros", value: 6, color: "#e5e7eb" },
];

const lineData = [
  { mes: "Ene 24", proyecto: null, historico: 2850 },
  { mes: "Mar 24", proyecto: null, historico: 2920 },
  { mes: "Jun 24", proyecto: null, historico: 3010 },
  { mes: "Sep 24", proyecto: null, historico: 3080 },
  { mes: "Dic 24", proyecto: null, historico: 3150 },
  { mes: "Mar 25", proyecto: 3480, historico: 3210 },
  { mes: "Abr 25", proyecto: 3320, historico: 3240 },
];

const PROCESSING_STEPS = [
  "Extrayendo ítems del documento",
  "Normalizando unidades de medida",
  "Clasificando partidas por rubro",
  "Comparando con benchmark Uruguay",
  "Generando reporte de análisis",
];

const CONTRACTOR_COLORS = { vázquez: "#4B0082", dasso: "#DC143C", buildcorp: "#FF4500" };

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", fontSize: "13px" }}>
      <p style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "8px" }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color ?? entry.fill, marginBottom: "3px" }}>
          <span style={{ fontWeight: 600 }}>{entry.name}:</span> USD {entry.value}
        </p>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { selectedProject, setActiveView, setSelectedProject } = useApp();
  const [activeTab, setActiveTab] = useState("documents");

  function goBack() {
    setSelectedProject(null);
    setActiveView("dashboard");
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAFAFA", minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "20px 40px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f5",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={goBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "8px",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <ChevronLeft size={16} />
          Proyectos
        </button>
        <span style={{ color: "#d1d5db" }}>/</span>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a2e" }}>
          {selectedProject?.name ?? "Proyecto"}
        </h2>
        {selectedProject?.location && (
          <span
            style={{
              fontSize: "12px",
              color: "#8A2BE2",
              background: "rgba(138,43,226,0.08)",
              padding: "3px 10px",
              borderRadius: "20px",
              fontWeight: 500,
            }}
          >
            {selectedProject.location}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 40px", background: "#fff", borderBottom: "1px solid #f0f0f5", display: "flex", gap: "0" }}>
        {[
          { id: "documents", label: "Documentos" },
          { id: "analysis", label: "Análisis" },
        ].map(({ id, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                padding: "16px 24px",
                fontSize: "14px",
                fontWeight: active ? 700 : 500,
                color: active ? "#4B0082" : "#9ca3af",
                background: "none",
                border: "none",
                borderBottom: active ? "2.5px solid #4B0082" : "2.5px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: "-1px",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        {activeTab === "documents" ? <DocumentsTab /> : <AnalysisTab />}
      </div>
    </div>
  );
}

// ── Documents Tab ──────────────────────────────────────────────────────────────

function DocumentsTab() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(incoming) {
    const valid = Array.from(incoming).filter(
      (f) => f.name.endsWith(".pdf") || f.name.endsWith(".xlsx") || f.name.endsWith(".csv")
    );
    setFiles((prev) => [...prev, ...valid.map((f) => ({ file: f, id: Math.random().toString(36).slice(2) }))]);
  }

  async function analyze() {
    setProcessing(true);
    for (let i = 1; i <= PROCESSING_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    }
    setProcessing(false);
    setDone(true);
  }

  return (
    <div style={{ maxWidth: "680px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", marginBottom: "6px" }}>
        Documentos de oferta
      </h3>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px" }}>
        Cargue las planillas de presupuesto de cada contratista (PDF o Excel).
      </p>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !processing && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#8A2BE2" : "#d1d5db"}`,
          borderRadius: "14px",
          padding: "48px 32px",
          textAlign: "center",
          cursor: processing ? "not-allowed" : "pointer",
          background: dragging ? "rgba(138,43,226,0.04)" : "#fff",
          transition: "all 0.2s",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: dragging ? "rgba(138,43,226,0.12)" : "#f5f0ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Upload size={24} style={{ color: "#8A2BE2" }} />
        </div>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a2e", marginBottom: "6px" }}>
          Arrastre archivos aquí o{" "}
          <span style={{ color: "#8A2BE2", textDecoration: "underline" }}>seleccione desde su equipo</span>
        </p>
        <p style={{ fontSize: "13px", color: "#9ca3af" }}>PDF, Excel (.xlsx), CSV</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.xlsx,.csv"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1.5px solid #f0f0f5",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          {files.map(({ file, id }, idx) => (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "13px 16px",
                borderBottom: idx < files.length - 1 ? "1px solid #f0f0f5" : "none",
              }}
            >
              <FileText size={16} style={{ color: "#8A2BE2", flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: "14px", color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </span>
              <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0 }}>
                {(file.size / 1024).toFixed(0)} KB
              </span>
              {!processing && !done && (
                <button
                  onClick={(e) => { e.stopPropagation(); setFiles((p) => p.filter((f) => f.id !== id)); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: "2px" }}
                >
                  <X size={14} />
                </button>
              )}
              {done && <CheckCircle size={15} style={{ color: "#059669" }} />}
            </div>
          ))}
        </div>
      )}

      {/* Processing */}
      {processing && <ProcessingPanel currentStep={currentStep} />}

      {/* Done message */}
      {done && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(5,150,105,0.07)",
            border: "1px solid rgba(5,150,105,0.2)",
            marginBottom: "20px",
          }}
        >
          <CheckCircle size={20} style={{ color: "#059669", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>Análisis completado</p>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              {files.length} archivo{files.length !== 1 ? "s" : ""} procesado{files.length !== 1 ? "s" : ""}. Vaya a la pestaña "Análisis" para ver los resultados.
            </p>
          </div>
        </div>
      )}

      {/* Analyze button */}
      {!done && (
        <button
          onClick={analyze}
          disabled={files.length === 0 || processing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            background: files.length === 0 || processing
              ? "#e5e7eb"
              : "linear-gradient(135deg, #8A2BE2 0%, #FF4500 100%)",
            color: files.length === 0 || processing ? "#9ca3af" : "#fff",
            fontWeight: 600,
            fontSize: "14px",
            cursor: files.length === 0 || processing ? "not-allowed" : "pointer",
            boxShadow: files.length > 0 && !processing ? "0 4px 14px rgba(138,43,226,0.3)" : "none",
            transition: "all 0.2s",
          }}
        >
          <Cpu size={16} />
          Analizar con IA
        </button>
      )}
    </div>
  );
}

function ProcessingPanel({ currentStep }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1.5px solid #f0f0f5",
        padding: "20px 24px",
        marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #8A2BE2, #FF4500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Cpu size={16} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>Analizando con IA…</p>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Normalizando y comparando ofertas</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {PROCESSING_STEPS.map((step, i) => {
          const stepN = i + 1;
          const state = stepN < currentStep ? "done" : stepN === currentStep ? "active" : "pending";
          return (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "20px", height: "20px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {state === "done" && <CheckCircle size={16} style={{ color: "#059669" }} />}
                {state === "active" && (
                  <span
                    style={{
                      width: "14px", height: "14px",
                      border: "2.5px solid #8A2BE2",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                )}
                {state === "pending" && (
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e5e7eb", display: "inline-block" }} />
                )}
              </div>
              <span style={{ fontSize: "13px", color: state === "done" ? "#059669" : state === "active" ? "#4B0082" : "#9ca3af", fontWeight: state === "active" ? 600 : 400 }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: "16px", height: "4px", background: "#f0f0f5", borderRadius: "4px" }}>
        <div
          style={{
            height: "4px",
            borderRadius: "4px",
            background: "linear-gradient(90deg, #8A2BE2, #FF4500)",
            width: `${(currentStep / PROCESSING_STEPS.length) * 100}%`,
            transition: "width 0.5s ease",
          }}
        />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Analysis Tab ───────────────────────────────────────────────────────────────

function AnalysisTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
          Análisis de ofertas
        </h3>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Comparativa normalizada de contratistas vs. benchmark de mercado Uruguay Q1 2025
        </p>
      </div>

      {/* Chart 1 — Bar: Apples to Apples */}
      <ChartCard
        title="Comparación Peras con Peras™"
        subtitle="Precio unitario por rubro (USD) — 3 contratistas vs. referencia de mercado"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
            <XAxis dataKey="rubro" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={45} />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>}
            />
            <Bar dataKey="vázquez" name="Vázquez S.A." fill="#4B0082" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="dasso" name="Dasso & Asoc." fill="#DC143C" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="buildcorp" name="BuildCorp UY" fill="#FF4500" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="mercado" name="Mercado UY" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>

        {/* Deviation table */}
        <div style={{ marginTop: "20px", borderTop: "1px solid #f0f0f5", paddingTop: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
            Desvío vs. mercado
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "8px" }}>
            {barData.map((row) => {
              const bestBid = Math.min(row.vázquez, row.dasso, row.buildcorp);
              const pct = ((bestBid - row.mercado) / row.mercado * 100).toFixed(1);
              const over = Number(pct) > 0;
              return (
                <div key={row.rubro} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>{row.rubro}</p>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: over ? "rgba(220,20,60,0.1)" : "rgba(5,150,105,0.1)",
                      color: over ? "#DC143C" : "#059669",
                    }}
                  >
                    {over ? "+" : ""}{pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ChartCard>

      {/* Charts 2 & 3 — side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Chart 2 — Pie: Cost distribution */}
        <ChartCard
          title="Distribución por Rubro"
          subtitle="Peso relativo de cada partida sobre el total"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, ""]}
                  contentStyle={{ borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
              {pieData.map(({ name, value, color }) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#374151", flex: 1 }}>{name}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a2e" }}>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Chart 3 — Line: Historical deviation */}
        <ChartCard
          title="Desvío Histórico"
          subtitle="Precio por m² — este proyecto vs. proyectos anteriores en Uruguay"
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={42} domain={[2500, 3700]} />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="historico"
                name="Promedio histórico UY"
                stroke="#d1d5db"
                strokeWidth={2}
                dot={{ r: 3, fill: "#d1d5db" }}
                strokeDasharray="5 4"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="proyecto"
                name="Este proyecto"
                stroke="#DC143C"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#DC143C", strokeWidth: 0 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>

          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "12px" }}>
            Las últimas 2 ofertas se encuentran{" "}
            <span style={{ color: "#DC143C", fontWeight: 600 }}>+7.5% sobre el promedio histórico</span>{" "}
            de proyectos similares en Uruguay.
          </p>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "24px",
        border: "1.5px solid #f0f0f5",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e", marginBottom: "3px" }}>{title}</h4>
        <p style={{ fontSize: "12px", color: "#9ca3af" }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
