"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ComplexityBadge from "@/components/platform/ComplexityBadge";
import AlertBanner from "@/components/platform/AlertBanner";

interface OppDetail {
  id: string; title: string; description: string; funder: string; sector: string;
  complexity: string; location: string | null; budget: string | null; closingDate: string;
  interestCount: number; isSaved: boolean; isInterested: boolean;
  requirements: string[]; strategicAdvice: string | null; requiredDocs: string[];
  collaborations: { id: string; title: string; status: string; memberCount: number }[];
}

interface Interested {
  userId: string; level: string; companyName: string; sector: string;
  city: string; specialties: string | null; availability: string | null;
}

const AVAILABILITY_COLORS: Record<string, string> = {
  AVAILABLE: "#6dd49a", PARTIAL: "#e8b86d", BUSY: "#f08080",
};

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function OppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [opp, setOpp]           = useState<OppDetail | null>(null);
  const [interested, setInterested] = useState<Interested[]>([]);
  const [myLevel, setMyLevel]   = useState<string | null>(null);
  const [showInterested, setShowInterested] = useState(false);
  const [showAccForm, setShowAccForm] = useState(false);
  const [accForm, setAccForm]   = useState({ type: "dossier", message: "" });
  const [accSent, setAccSent]   = useState(false);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [newCollabTitle, setNewCollabTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/opportunities/${id}`).then((r) => r.json()).then((d) => {
      setOpp(d);
      setMyLevel(d.isInterested ? (d.interestLevel ?? "INTERESTED") : null);
    });
    fetch(`/api/opportunities/${id}/interested`).then((r) => r.json()).then(setInterested);
  }, [id]);

  useEffect(() => {
    load();
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setCurrentUserId(d.id));
  }, [load]);

  async function toggleInterest() {
    const res = await fetch(`/api/opportunities/${id}/interest`, { method: "POST" });
    const data = await res.json();
    setMyLevel(data.interested ? "INTERESTED" : null);
    load();
  }

  async function toggleParticipate() {
    const res = await fetch(`/api/opportunities/${id}/participate`, { method: "POST" });
    const data = await res.json();
    setMyLevel(data.level);
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
    if (data.id) router.push(`/membre/collaborations/${data.id}`);
  }

  async function joinCollab(collabId: string) {
    await fetch(`/api/collaborations/${collabId}/join`, { method: "POST" });
    router.push(`/membre/collaborations/${collabId}`);
  }

  async function sendAccompagnement() {
    if (!accForm.message.trim()) return;
    await fetch("/api/accompagnement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id, ...accForm }),
    });
    setAccSent(true);
    setShowAccForm(false);
  }

  async function submitDossier() {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id }),
    });
    router.push("/membre/soumissions");
  }

  if (!opp) return <div style={{ color: "var(--p-dim)", fontSize: 13, padding: 20 }}>Chargement…</div>;

  const days     = daysUntil(opp.closingDate);
  const cardStyle: React.CSSProperties = { background: "var(--p-surface)", border: "0.5px solid var(--p-border2)", borderRadius: 10, padding: 20, marginBottom: 14 };

  return (
    <div>
      <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--p-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 16, padding: 0 }}>
        ← Retour aux opportunités
      </button>

      {accSent && <AlertBanner variant="success">Votre demande d'accompagnement a été envoyée à l'équipe UNIE BTP.</AlertBanner>}
      {days <= 0 && <AlertBanner variant="error">Cet appel d'offres est clôturé depuis le {new Date(opp.closingDate).toLocaleDateString("fr-FR")}.</AlertBanner>}
      {days > 0 && days <= 7 && <AlertBanner variant="warning">⚡ Clôture dans {days} jour{days > 1 ? "s" : ""} — action urgente requise.</AlertBanner>}

      <div style={cardStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--p-font-display)", fontSize: 22, fontWeight: 600, color: "var(--p-text)", margin: "0 0 8px", lineHeight: 1.2 }}>{opp.title}</h1>
            <div style={{ fontSize: 12, color: "var(--p-muted)", marginBottom: 10 }}>{opp.funder} · Publication récente {opp.location ? `· ${opp.location}` : ""}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(42,127,204,.1)", color: "#6eb3e8", border: "0.5px solid rgba(42,127,204,.28)" }}>{opp.funder}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(61,168,98,.08)", color: "#6dd49a", border: "0.5px solid rgba(61,168,98,.22)" }}>{opp.sector}</span>
              <ComplexityBadge complexity={opp.complexity} showLabel />
              {opp.budget && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "var(--p-gold-dim)", color: "var(--p-gold)", border: "0.5px solid rgba(237,97,32,.25)" }}>{opp.budget}</span>}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: "var(--p-muted)" }}>Clôture dossier</div>
            <div style={{ fontFamily: "var(--p-font-mono)", fontSize: 24, color: days <= 0 ? "#7a8590" : days <= 7 ? "#f08080" : days <= 14 ? "#e8b86d" : "#6dd49a" }}>
              {new Date(opp.closingDate).toLocaleDateString("fr-FR")}
            </div>
            <div style={{ fontSize: 11, color: "var(--p-dim)" }}>
              {days <= 0 ? "Clôturé" : `J-${days}`}
            </div>
          </div>
        </div>

        <div style={{ height: "0.5px", background: "var(--p-border)", margin: "16px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 10 }}>Résumé du projet</div>
            <p style={{ fontSize: 13, color: "var(--p-text)", lineHeight: 1.65, margin: "0 0 16px" }}>{opp.description}</p>

            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 10 }}>Critères d'éligibilité</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {opp.requirements.map((r, i) => (
                <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--p-text)" }}>
                  <span style={{ color: "var(--p-gold)", flexShrink: 0 }}>›</span>{r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {opp.strategicAdvice && (
              <div style={{ background: "rgba(61,168,98,.07)", border: "0.5px solid rgba(61,168,98,.22)", borderLeft: "3px solid #3da862", borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#6dd49a", marginBottom: 6 }}>Recommandation MICENY</div>
                <p style={{ fontSize: 12, color: "#6dd49a", margin: 0, lineHeight: 1.55 }}>{opp.strategicAdvice}</p>
              </div>
            )}

            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 10 }}>Documents requis</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {opp.requiredDocs.map((d, i) => (
                <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--p-text)" }}>
                  <span style={{ color: "var(--p-gold)", flexShrink: 0 }}>›</span>{d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ height: "0.5px", background: "var(--p-border)", margin: "16px 0" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={toggleInterest} style={{ padding: "8px 14px", fontSize: 12, background: myLevel === "INTERESTED" || myLevel === "PARTICIPATING" ? "rgba(237,97,32,.22)" : "rgba(237,97,32,.1)", border: "0.5px solid rgba(237,97,32,.4)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer", fontWeight: 600 }}>
            {myLevel === "INTERESTED" || myLevel === "PARTICIPATING" ? "✓ Intéressé" : "Je suis intéressé"}
          </button>
          <button onClick={toggleParticipate} style={{ padding: "8px 14px", fontSize: 12, background: myLevel === "PARTICIPATING" ? "rgba(61,168,98,.2)" : "rgba(61,168,98,.08)", border: "0.5px solid rgba(61,168,98,.3)", borderRadius: 6, color: "#6dd49a", cursor: "pointer", fontWeight: myLevel === "PARTICIPATING" ? 700 : 400 }}>
            {myLevel === "PARTICIPATING" ? "✓ Je participe" : "Je veux participer"}
          </button>
          <button onClick={toggleSave} style={{ padding: "8px 12px", fontSize: 12, background: opp.isSaved ? "rgba(237,97,32,.15)" : "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: opp.isSaved ? "var(--p-gold)" : "var(--p-muted)", cursor: "pointer" }}>
            {opp.isSaved ? "★ Sauvegardé" : "☆ Sauvegarder"}
          </button>
          <button onClick={() => setShowCollabForm(true)} style={{ padding: "8px 14px", fontSize: 12, background: "rgba(42,127,204,.1)", border: "0.5px solid rgba(42,127,204,.3)", borderRadius: 6, color: "#6eb3e8", cursor: "pointer" }}>
            + Proposer un groupement
          </button>
          <button onClick={submitDossier} style={{ padding: "8px 14px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
            Déclarer un dossier
          </button>
          <button onClick={() => router.push("/membre/outils")} style={{ padding: "8px 14px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
            Checklist & modèles
          </button>
          <button onClick={() => setShowAccForm(true)} style={{ padding: "8px 14px", fontSize: 12, background: "rgba(210,153,34,.1)", border: "0.5px solid rgba(210,153,34,.28)", borderRadius: 6, color: "#e8b86d", cursor: "pointer" }}>
            Demander un accompagnement
          </button>
        </div>

        {/* Formulaire accompagnement */}
        {showAccForm && (
          <div style={{ marginTop: 14, padding: 14, background: "var(--p-surface2)", borderRadius: 8, border: "0.5px solid rgba(210,153,34,.25)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e8b86d", marginBottom: 10 }}>Demande d'accompagnement</div>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10 }}>
              <select value={accForm.type} onChange={(e) => setAccForm((f) => ({ ...f, type: e.target.value }))}
                style={{ padding: "8px 10px", background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 12, color: "var(--p-text)" }}>
                <option value="dossier">Montage de dossier</option>
                <option value="strategie">Conseil stratégique</option>
                <option value="formation">Formation</option>
                <option value="autre">Autre</option>
              </select>
              <input value={accForm.message} onChange={(e) => setAccForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Décrivez votre besoin…"
                style={{ padding: "8px 10px", background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 12, color: "var(--p-text)" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={sendAccompagnement} style={{ padding: "6px 14px", fontSize: 11, background: "rgba(210,153,34,.2)", border: "0.5px solid rgba(210,153,34,.4)", borderRadius: 5, color: "#e8b86d", cursor: "pointer" }}>
                Envoyer la demande
              </button>
              <button onClick={() => setShowAccForm(false)} style={{ padding: "6px 10px", fontSize: 11, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 5, color: "var(--p-muted)", cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Formulaire groupement */}
        {showCollabForm && (
          <div style={{ marginTop: 12, padding: 14, background: "var(--p-surface2)", borderRadius: 8, border: "0.5px solid rgba(42,127,204,.25)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#6eb3e8", marginBottom: 8 }}>Nouveau groupement</div>
            <input value={newCollabTitle} onChange={(e) => setNewCollabTitle(e.target.value)}
              placeholder="Ex: Groupement Lot 2 – Routes Nord"
              style={{ width: "100%", padding: "8px 10px", background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 12, color: "var(--p-text)", marginBottom: 8, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={createCollab} disabled={creating} style={{ padding: "6px 14px", fontSize: 11, background: "var(--p-gold)", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer" }}>
                {creating ? "Création…" : "Créer"}
              </button>
              <button onClick={() => setShowCollabForm(false)} style={{ padding: "6px 10px", fontSize: 11, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 5, color: "var(--p-muted)", cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Membres intéressés */}
      {interested.length > 0 && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)" }}>
              Membres intéressés ({interested.length})
            </div>
            <button onClick={() => setShowInterested(!showInterested)} style={{ fontSize: 11, background: "none", border: "none", color: "var(--p-muted)", cursor: "pointer" }}>
              {showInterested ? "Réduire ▲" : "Voir tous ▼"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(showInterested ? interested : interested.slice(0, 3)).map((m) => (
              <div key={m.userId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--p-surface2)", borderRadius: 7 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--p-gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--p-gold)", flexShrink: 0 }}>
                  {m.companyName.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)" }}>{m.companyName}</div>
                  <div style={{ fontSize: 11, color: "var(--p-muted)" }}>{m.sector} · {m.city}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {m.level === "PARTICIPATING" && (
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "rgba(61,168,98,.12)", color: "#6dd49a", border: "0.5px solid rgba(61,168,98,.28)" }}>Participe</span>
                  )}
                  {m.availability && (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: AVAILABILITY_COLORS[m.availability] ?? "var(--p-dim)", display: "inline-block" }} title={m.availability} />
                  )}
                  {m.userId !== currentUserId && (
                    <button onClick={() => router.push(`/membre/membres/${m.userId}`)} style={{ fontSize: 10, padding: "3px 8px", background: "rgba(237,97,32,.1)", border: "0.5px solid rgba(237,97,32,.25)", borderRadius: 4, color: "var(--p-gold)", cursor: "pointer" }}>
                      Profil
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!showInterested && interested.length > 3 && (
              <button onClick={() => setShowInterested(true)} style={{ fontSize: 11, color: "var(--p-muted)", background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: "4px" }}>
                + {interested.length - 3} autre{interested.length - 3 > 1 ? "s" : ""} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collaborations */}
      {opp.collaborations.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 10 }}>
            Groupements sur cette opportunité ({opp.collaborations.length})
          </div>
          {opp.collaborations.map((c) => (
            <div key={c.id} style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 8, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--p-muted)", marginTop: 2 }}>{c.memberCount} membre{c.memberCount > 1 ? "s" : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => joinCollab(c.id)} style={{ padding: "5px 10px", fontSize: 11, background: "rgba(42,127,204,.12)", border: "0.5px solid rgba(42,127,204,.3)", borderRadius: 5, color: "#6eb3e8", cursor: "pointer" }}>
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
