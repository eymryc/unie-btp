"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ComplexityBadge from "@/components/platform/ComplexityBadge";
import TopBar from "@/components/platform/TopBar";

interface Opp {
  id: string;
  title: string;
  description: string;
  funder: string;
  sector: string;
  complexity: string;
  location: string | null;
  budget: string | null;
  closingDate: string;
  interestCount: number;
  isSaved: boolean;
  isInterested: boolean;
}

const FUNDERS = ["Tous", "BAD", "Banque Mondiale", "AFD", "Ministère"];
const SECTORS = ["Tous", "BTP – Routes", "Bâtiment", "Hydraulique", "Énergie"];
const COMPLEXITIES = [
  { value: "", label: "Complexité" },
  { value: "ACCESSIBLE", label: "Accessible seul" },
  { value: "GROUPEMENT", label: "Groupement conseillé" },
  { value: "CONSORTIUM", label: "Consortium requis" },
];

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function OpportunitesPage() {
  const router = useRouter();
  const [opps, setOpps] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [funder, setFunder] = useState("Tous");
  const [sector, setSector] = useState("Tous");
  const [complexity, setComplexity] = useState("");

  const fetchOpps = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (funder !== "Tous") params.set("funder", funder);
    if (sector !== "Tous") params.set("sector", sector);
    if (complexity) params.set("complexity", complexity);
    fetch(`/api/opportunities?${params}`)
      .then((r) => r.json())
      .then((d) => { setOpps(d); setLoading(false); });
  }, [funder, sector, complexity]);

  useEffect(() => { fetchOpps(); }, [fetchOpps]);

  async function toggleSave(id: string) {
    await fetch(`/api/opportunities/${id}/save`, { method: "POST" });
    fetchOpps();
  }

  async function toggleInterest(id: string) {
    await fetch(`/api/opportunities/${id}/interest`, { method: "POST" });
    fetchOpps();
  }

  const selectStyle: React.CSSProperties = {
    padding: "6px 10px",
    background: "var(--p-surface2)",
    border: "0.5px solid var(--p-border)",
    borderRadius: 6,
    fontSize: 12,
    color: "var(--p-text)",
    cursor: "pointer",
  };

  return (
    <div>
      <TopBar
        title="Opportunités de marchés"
        subtitle={`${opps.length} appels d'offres actifs`}
      />

      {/* Légende complexité */}
      <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
        {[["ACCESSIBLE", "Accessible seul"], ["GROUPEMENT", "Groupement conseillé"], ["CONSORTIUM", "Consortium requis"]].map(([v, l]) => (
          <span key={v} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--p-muted)" }}>
            <ComplexityBadge complexity={v} /> {l}
          </span>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <select value={funder} onChange={(e) => setFunder(e.target.value)} style={selectStyle}>
          {FUNDERS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <select value={sector} onChange={(e) => setSector(e.target.value)} style={selectStyle}>
          {SECTORS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={complexity} onChange={(e) => setComplexity(e.target.value)} style={selectStyle}>
          {COMPLEXITIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : opps.length === 0 ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12, padding: "10px 0" }}>Aucune opportunité disponible avec ces filtres.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 10 }}>
          {opps.map((o) => {
            const days = daysUntil(o.closingDate);
            const urgent = days <= 10;
            return (
              <div
                key={o.id}
                onClick={() => router.push(`/membre/opportunites/${o.id}`)}
                style={{
                  background: "var(--p-surface)",
                  border: "0.5px solid var(--p-border)",
                  borderRadius: 12,
                  padding: 16,
                  cursor: "pointer",
                  transition: "transform .12s ease, border-color .12s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--p-border2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--p-border)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <ComplexityBadge complexity={o.complexity} />
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(56,139,253,.1)", color: "#79b8ff", border: "0.5px solid rgba(56,139,253,.3)" }}>
                      {o.funder}
                    </span>
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(46,160,67,.08)", color: "#6dd49a", border: "0.5px solid rgba(46,160,67,.25)" }}>
                      {o.sector}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: urgent ? "#f08080" : "var(--p-text)", fontWeight: urgent ? 700 : 500 }}>
                      {new Date(o.closingDate).toLocaleDateString("fr-FR")}
                    </div>
                    <div style={{ fontSize: 10, color: urgent ? "#f08080" : "var(--p-dim)" }}>
                      {days <= 0 ? "Clôturé" : `J-${days}`}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--p-text)", marginBottom: 8, lineHeight: 1.25 }}>
                  {o.title}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                  {o.budget && (
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(237,97,32,.08)", color: "var(--p-gold)", border: "0.5px solid rgba(237,97,32,.2)" }}>
                      {o.budget}
                    </span>
                  )}
                  {o.location && (
                    <span style={{ fontSize: 10, color: "var(--p-dim)" }}>📍 {o.location}</span>
                  )}
                  <span style={{ fontSize: 10, color: "var(--p-dim)" }}>
                    {o.interestCount} intérêt{o.interestCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInterest(o.id);
                    }}
                    style={{
                      padding: "6px 10px",
                      fontSize: 11,
                      background: o.isInterested ? "rgba(237,97,32,.2)" : "transparent",
                      border: "0.5px solid",
                      borderColor: o.isInterested ? "rgba(237,97,32,.4)" : "var(--p-border)",
                      borderRadius: 6,
                      color: o.isInterested ? "var(--p-gold)" : "var(--p-muted)",
                      cursor: "pointer",
                      fontWeight: o.isInterested ? 700 : 500,
                      flex: 1,
                    }}
                  >
                    {o.isInterested ? "✓ Intéressé" : "Intéressé"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(o.id);
                    }}
                    style={{
                      padding: "6px 10px",
                      fontSize: 11,
                      background: o.isSaved ? "rgba(237,97,32,.15)" : "transparent",
                      border: "0.5px solid var(--p-border)",
                      borderRadius: 6,
                      color: o.isSaved ? "var(--p-gold)" : "var(--p-muted)",
                      cursor: "pointer",
                      width: 60,
                    }}
                  >
                    {o.isSaved ? "★" : "☆"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
