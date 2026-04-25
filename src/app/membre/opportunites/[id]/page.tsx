"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ComplexityBadge from "@/components/platform/ComplexityBadge";

interface OppDetail {
  id: string; title: string; description: string; funder: string; sector: string;
  complexity: string; location: string | null; budget: string | null; closingDate: string;
  interestCount: number; isSaved: boolean; isInterested: boolean;
  requirements: string[]; strategicAdvice: string | null; requiredDocs: string[];
  collaborations: { id: string; title: string; status: string; memberCount: number }[];
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function OppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [opp, setOpp] = useState<OppDetail | null>(null);
  const [creating, setCreating] = useState(false);
  const [newCollabTitle, setNewCollabTitle] = useState("");
  const [showCollabForm, setShowCollabForm] = useState(false);

  function load() {
    fetch(`/api/opportunities/${id}`).then((r) => r.json()).then(setOpp);
  }

  useEffect(() => { load(); }, [id]);

  async function toggleInterest() {
    await fetch(`/api/opportunities/${id}/interest`, { method: "POST" });
    load();
  }

  async function toggleSave() {
    await fetch(`/api/opportunities/${id}/save`, { method: "POST" });
    load();
  }

  async function createCollab() {
    if (!newCollabTitle.trim()) return;
    setCreating(true);
    const res = await fetch("/api/collaborations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newCollabTitle, opportunityId: id }),
    });
    const data = await res.json();
    setCreating(false);
    setShowCollabForm(false);
    setNewCollabTitle("");
    if (data.id) router.push(`/membre/collaborations/${data.id}`);
  }

  async function joinCollab(collabId: string) {
    await fetch(`/api/collaborations/${collabId}/join`, { method: "POST" });
    router.push(`/membre/collaborations/${collabId}`);
  }

  async function submitDossier() {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id }),
    });
    alert("Dossier déclaré comme en cours de préparation.");
  }

  if (!opp) return <div style={{ color: "var(--p-dim)", fontSize: 13, padding: 20 }}>Chargement…</div>;

  const days = daysUntil(opp.closingDate);

  const cardStyle: React.CSSProperties = {
    background: "var(--p-surface)",
    border: "0.5px solid var(--p-border2)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 14,
  };

  return (
    <div>
      <button
        onClick={() => router.back()}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--p-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 16, padding: 0 }}
      >
        ← Retour aux opportunités
      </button>

      <div style={cardStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--p-text)", margin: "0 0 8px" }}>{opp.title}</h1>
            <div style={{ fontSize: 12, color: "var(--p-muted)", marginBottom: 10 }}>
              {opp.funder} · Publication récente
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(56,139,253,.1)", color: "#79b8ff", border: "0.5px solid rgba(56,139,253,.3)" }}>{opp.funder}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(46,160,67,.08)", color: "#6dd49a", border: "0.5px solid rgba(46,160,67,.25)" }}>{opp.sector}</span>
              <ComplexityBadge complexity={opp.complexity} showLabel />
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: "var(--p-muted)" }}>Clôture dossier</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: days <= 10 ? "#f08080" : "#f0c060" }}>
              {new Date(opp.closingDate).toLocaleDateString("fr-FR")}
            </div>
            <div style={{ fontSize: 11, color: "var(--p-dim)" }}>
              {days > 0 ? `Il reste ${days} jour${days > 1 ? "s" : ""}` : "Clôturé"}
            </div>
          </div>
        </div>

        <div style={{ height: "0.5px", background: "var(--p-border)", margin: "16px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--p-gold)", marginBottom: 8 }}>Résumé du projet</div>
            <p style={{ fontSize: 12, color: "var(--p-text)", lineHeight: 1.6, margin: "0 0 16px" }}>{opp.description}</p>

            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--p-gold)", marginBottom: 8 }}>Critères d'éligibilité</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
              {opp.requirements.map((r, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--p-text)" }}>
                  <span style={{ color: "var(--p-gold)", flexShrink: 0 }}>›</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div>
            {opp.strategicAdvice && (
              <div style={{ background: "rgba(46,160,67,.08)", border: "0.5px solid rgba(46,160,67,.25)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6dd49a", marginBottom: 4 }}>Recommandation MICENY</div>
                <p style={{ fontSize: 12, color: "#6dd49a", margin: 0, lineHeight: 1.5 }}>{opp.strategicAdvice}</p>
              </div>
            )}

            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--p-gold)", marginBottom: 8 }}>Documents requis</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
              {opp.requiredDocs.map((d, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--p-text)" }}>
                  <span style={{ color: "var(--p-gold)", flexShrink: 0 }}>›</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ height: "0.5px", background: "var(--p-border)", margin: "16px 0" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={toggleInterest} style={{ padding: "7px 14px", fontSize: 12, background: opp.isInterested ? "rgba(237,97,32,.25)" : "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.4)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer", fontWeight: opp.isInterested ? 600 : 400 }}>
            {opp.isInterested ? "✓ Intéressé" : "Je suis intéressé"}
          </button>
          <button onClick={toggleSave} style={{ padding: "7px 14px", fontSize: 12, background: opp.isSaved ? "rgba(237,97,32,.15)" : "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: opp.isSaved ? "var(--p-gold)" : "var(--p-muted)", cursor: "pointer" }}>
            {opp.isSaved ? "★ Sauvegardé" : "☆ Sauvegarder"}
          </button>
          <button onClick={() => setShowCollabForm(true)} style={{ padding: "7px 14px", fontSize: 12, background: "rgba(46,160,67,.1)", border: "0.5px solid rgba(46,160,67,.3)", borderRadius: 6, color: "#6dd49a", cursor: "pointer" }}>
            + Proposer un groupement
          </button>
          <button onClick={submitDossier} style={{ padding: "7px 14px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
            Déclarer un dossier
          </button>
          <button onClick={() => router.push("/membre/outils")} style={{ padding: "7px 14px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
            Checklist & modèles
          </button>
        </div>

        {/* Collab form */}
        {showCollabForm && (
          <div style={{ marginTop: 12, padding: 12, background: "var(--p-surface2)", borderRadius: 8, border: "0.5px solid var(--p-border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--p-text)", marginBottom: 8 }}>Nouveau groupement</div>
            <input
              value={newCollabTitle}
              onChange={(e) => setNewCollabTitle(e.target.value)}
              placeholder="Ex: Groupement Lot 2 – Routes Nord"
              style={{ width: "100%", padding: "8px 10px", background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 5, fontSize: 12, color: "var(--p-text)", marginBottom: 8, boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={createCollab} disabled={creating} style={{ padding: "6px 12px", fontSize: 11, background: "var(--p-gold)", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer" }}>
                {creating ? "Création…" : "Créer le groupement"}
              </button>
              <button onClick={() => setShowCollabForm(false)} style={{ padding: "6px 10px", fontSize: 11, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 5, color: "var(--p-muted)", cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collaborations existantes */}
      {opp.collaborations.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-muted)", marginBottom: 10 }}>Groupements sur cette opportunité ({opp.collaborations.length})</div>
          {opp.collaborations.map((c) => (
            <div key={c.id} style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 8, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--p-muted)", marginTop: 2 }}>{c.memberCount} membre{c.memberCount > 1 ? "s" : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => joinCollab(c.id)} style={{ padding: "5px 10px", fontSize: 11, background: "rgba(56,139,253,.12)", border: "0.5px solid rgba(56,139,253,.3)", borderRadius: 5, color: "#79b8ff", cursor: "pointer" }}>
                  Rejoindre
                </button>
                <button onClick={() => router.push(`/membre/collaborations/${c.id}`)} style={{ padding: "5px 10px", fontSize: 11, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 5, color: "var(--p-muted)", cursor: "pointer" }}>
                  Voir →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
