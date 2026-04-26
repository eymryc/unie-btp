"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";
import AlertBanner from "@/components/platform/AlertBanner";
import DataTable, { Column } from "@/components/platform/DataTable";

interface Guide { id: string; title: string; description: string | null; category: string; fileUrl: string | null; }
interface TrainingSession { id: string; title: string; details: string; accentColor?: string | null; signupUrl?: string | null; }
interface FormationRequest {
  id: string;
  trainingSessionId: string | null;
  status: string;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  checklist: { label: "Checklists",  icon: "☑", color: "#6dd49a", bg: "rgba(46,160,67,.12)" },
  modele:    { label: "Modèles",     icon: "⊡", color: "#79b8ff", bg: "rgba(56,139,253,.12)" },
  guide:     { label: "Guides",      icon: "◎", color: "#f0c060", bg: "rgba(210,153,34,.12)" },
};

export default function OutilsPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [formationRequests, setFormationRequests] = useState<FormationRequest[]>([]);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/guides")
      .then((r) => r.json())
      .then((d) => { setGuides(d); setLoading(false); });
  }, []);

  useEffect(() => {
    fetch("/api/training-sessions")
      .then((r) => r.json())
      .then((d) => { setSessions(d); setSessionsLoading(false); })
      .catch(() => setSessionsLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/accompagnement?type=formation")
      .then((r) => r.json())
      .then((d) => setFormationRequests(Array.isArray(d) ? d : []))
      .catch(() => setFormationRequests([]));
  }, []);

  function isExternalUrl(url: string) {
    return /^https?:\/\//i.test(url) || /^mailto:/i.test(url);
  }

  function getRequestForSession(sessionId: string) {
    return formationRequests.find((r) => r.trainingSessionId === sessionId);
  }

  async function handleTrainingSignup(s: TrainingSession) {
    const url = (s.signupUrl ?? "").trim();
    if (url && isExternalUrl(url)) {
      window.open(url, "_blank");
      return;
    }

    const existing = getRequestForSession(s.id);
    if (existing) return;

    await fetch("/api/accompagnement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "formation",
        trainingSessionId: s.id,
        message: `Demande d'inscription / info formation: ${s.title} — ${s.details}`,
      }),
    });
    setRequestSuccess(`Demande envoyée pour « ${s.title} ». L'équipe vous contactera pour l'inscription.`);
    fetch("/api/accompagnement?type=formation")
      .then((r) => r.json())
      .then((d) => setFormationRequests(Array.isArray(d) ? d : []))
      .catch(() => {});
  }

  const filtered = filter === "all" ? guides : guides.filter((g) => g.category === filter);
  const guideColumns: Column<Guide>[] = [
    {
      key: "title",
      header: "Ressource",
      render: (g) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--p-text)" }}>{g.title}</div>
          {g.description && <div style={{ fontSize: 11, color: "var(--p-muted)", marginTop: 2 }}>{g.description}</div>}
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      width: 140,
      render: (g) => {
        const cfg = CATEGORY_LABELS[g.category] ?? { label: g.category, icon: "◻", color: "var(--p-muted)", bg: "var(--p-surface2)" };
        return (
          <span style={{ fontSize: 11, color: cfg.color }}>
            {cfg.icon} {cfg.label}
          </span>
        );
      },
    },
    {
      key: "file",
      header: "Fichier",
      width: 140,
      render: (g) => (
        <button
          onClick={() => g.fileUrl ? window.open(g.fileUrl, "_blank") : alert("Fichier disponible prochainement.")}
          style={{
            padding: "5px 10px",
            fontSize: 11,
            background: g.fileUrl ? "rgba(237,97,32,.12)" : "var(--p-surface2)",
            border: "0.5px solid",
            borderColor: g.fileUrl ? "rgba(237,97,32,.3)" : "var(--p-border)",
            borderRadius: 6,
            color: g.fileUrl ? "var(--p-gold)" : "var(--p-dim)",
            cursor: "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {g.fileUrl ? "Télécharger" : "Bientôt"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <TopBar
        title="Outils & Guides pratiques"
        subtitle="Ressources pour préparer et améliorer vos dossiers de soumission"
      />

      {requestSuccess && (
        <div style={{ marginBottom: 14 }}>
          <AlertBanner variant="success">
            {requestSuccess}
          </AlertBanner>
        </div>
      )}

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
      ) : guides.length === 0 ? (
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: "40px 24px", textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: .3 }}>⊡</div>
          <div style={{ fontSize: 14, color: "var(--p-muted)", marginBottom: 6 }}>Aucune ressource disponible pour l'instant</div>
          <p style={{ fontSize: 12, color: "var(--p-dim)", maxWidth: 400, margin: "0 auto" }}>
            L'équipe UNIE BTP prépare des checklists, modèles de mémoire technique et guides BAD/BM/AFD. Ils seront disponibles ici dès leur publication.
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: 18 }}>
          <DataTable<Guide>
            columns={guideColumns}
            data={filtered}
            searchPlaceholder="Rechercher un guide…"
            searchFn={(g, q) => [g.title, g.description ?? "", g.category].some((v) => v?.toLowerCase().includes(q))}
            pageSize={10}
            emptyMessage="Aucune ressource dans cette catégorie."
            getRowKey={(g) => g.id}
          />
        </div>
      )}

      {/* Sessions de formation */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-gold)", marginBottom: 12 }}>Formations & Sessions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 10 }}>
          {sessionsLoading ? (
            <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
          ) : sessions.length === 0 ? (
            <div style={{ color: "var(--p-dim)", fontSize: 12, padding: "8px 0" }}>Aucune session publiée pour le moment.</div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                style={{
                  background: "var(--p-surface)",
                  border: "0.5px solid var(--p-border)",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--p-text)", lineHeight: 1.25 }}>{s.title}</div>
                  {getRequestForSession(s.id) ? (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "rgba(56,139,253,.10)",
                        border: "0.5px solid rgba(56,139,253,.25)",
                        color: "#79b8ff",
                        height: "fit-content",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Demande envoyée
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "var(--p-surface2)",
                        border: "0.5px solid var(--p-border)",
                        color: "var(--p-dim)",
                        height: "fit-content",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Non demandé
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 11, color: s.accentColor ?? "var(--p-muted)" }}>{s.details}</div>

                <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                  <button
                    disabled={!!getRequestForSession(s.id)}
                    onClick={() => handleTrainingSignup(s)}
                    style={{
                      padding: "7px 12px",
                      fontSize: 11,
                      background: !!getRequestForSession(s.id) ? "var(--p-surface2)" : "rgba(237,97,32,.12)",
                      border: "0.5px solid",
                      borderColor: !!getRequestForSession(s.id) ? "var(--p-border)" : "rgba(237,97,32,.3)",
                      borderRadius: 7,
                      color: !!getRequestForSession(s.id) ? "var(--p-dim)" : "var(--p-gold)",
                      cursor: !!getRequestForSession(s.id) ? "default" : "pointer",
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    {s.signupUrl && isExternalUrl(s.signupUrl) ? "S'inscrire" : "Demander une inscription"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
