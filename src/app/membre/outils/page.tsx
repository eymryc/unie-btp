"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";

interface Guide { id: string; title: string; description: string | null; category: string; fileUrl: string | null; }

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  checklist: { label: "Checklists",  icon: "☑", color: "#6dd49a", bg: "rgba(46,160,67,.12)" },
  modele:    { label: "Modèles",     icon: "⊡", color: "#79b8ff", bg: "rgba(56,139,253,.12)" },
  guide:     { label: "Guides",      icon: "◎", color: "#f0c060", bg: "rgba(210,153,34,.12)" },
};

export default function OutilsPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/guides")
      .then((r) => r.json())
      .then((d) => { setGuides(d); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? guides : guides.filter((g) => g.category === filter);
  const grouped = filtered.reduce<Record<string, Guide[]>>((acc, g) => {
    (acc[g.category] = acc[g.category] ?? []).push(g);
    return acc;
  }, {});

  return (
    <div>
      <TopBar
        title="Outils & Guides pratiques"
        subtitle="Ressources pour préparer et améliorer vos dossiers de soumission"
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["all", "Tous"], ["checklist", "Checklists"], ["modele", "Modèles"], ["guide", "Guides"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            style={{
              padding: "6px 14px", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "0.5px solid",
              background: filter === v ? "rgba(237,97,32,.15)" : "transparent",
              borderColor: filter === v ? "rgba(237,97,32,.4)" : "var(--p-border)",
              color: filter === v ? "var(--p-gold)" : "var(--p-muted)",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => {
          const cfg = CATEGORY_LABELS[cat] ?? { label: cat, icon: "◻", color: "var(--p-muted)", bg: "var(--p-surface2)" };
          return (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                <span style={{ fontSize: 11, color: "var(--p-dim)" }}>({items.length})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
                {items.map((g) => (
                  <div key={g.id} style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                        {cfg.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--p-text)", lineHeight: 1.3 }}>{g.title}</div>
                        {g.description && <div style={{ fontSize: 11, color: "var(--p-muted)", marginTop: 3, lineHeight: 1.4 }}>{g.description}</div>}
                      </div>
                    </div>
                    <button
                      onClick={() => g.fileUrl ? window.open(g.fileUrl, "_blank") : alert("Fichier disponible prochainement.")}
                      style={{
                        padding: "6px 12px", fontSize: 11,
                        background: g.fileUrl ? cfg.bg : "var(--p-surface2)",
                        border: `0.5px solid ${g.fileUrl ? cfg.color + "44" : "var(--p-border)"}`,
                        borderRadius: 5, color: g.fileUrl ? cfg.color : "var(--p-dim)",
                        cursor: g.fileUrl ? "pointer" : "default", fontWeight: 500,
                      }}
                    >
                      {g.fileUrl ? "↓ Télécharger" : "Disponible prochainement"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Sessions de formation */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-gold)", marginBottom: 12 }}>Formations & Sessions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
          {[
            { title: "Processus appels d'offres BAD", date: "14 mai 2025 · 9h · Présentiel Abidjan", color: "#79b8ff" },
            { title: "Montage dossier Banque Mondiale", date: "28 mai 2025 · 15h · Webinaire", color: "#6dd49a" },
            { title: "Accompagnement individuel dossier", date: "Service payant · Cabinet MICENY", color: "var(--p-muted)" },
          ].map((s) => (
            <div key={s.title} style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--p-text)", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: s.color, marginBottom: 10 }}>{s.date}</div>
              <button style={{ padding: "5px 10px", fontSize: 11, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 5, color: "var(--p-gold)", cursor: "pointer" }}>
                S'inscrire
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
