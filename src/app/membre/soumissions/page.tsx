"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";
import StatusPill from "@/components/platform/StatusPill";
import AlertBanner from "@/components/platform/AlertBanner";

interface Sub {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  funder: string;
  status: string;
  result: string | null;
  notes: string | null;
  proofUrl: string | null;
  createdAt: string;
}

const RESULT_LABELS: Record<string, { label: string; color: string }> = {
  WON:     { label: "Remporté ✓", color: "#6dd49a" },
  LOST:    { label: "Perdu",      color: "#f08080" },
  PENDING: { label: "En attente", color: "#e8b86d" },
};

export default function SoumissionsPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: "", result: "", notes: "", proofUrl: "" });

  function load() {
    fetch("/api/submissions").then((r) => r.json()).then((d) => { setSubs(d); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  function openEdit(sub: Sub) {
    setEditId(sub.id);
    setEditForm({ status: sub.status, result: sub.result ?? "PENDING", notes: sub.notes ?? "", proofUrl: sub.proofUrl ?? "" });
  }

  async function saveEdit() {
    if (!editId) return;
    setUpdating(editId);
    await fetch(`/api/submissions/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setUpdating(null);
    setEditId(null);
    load();
  }

  const won  = subs.filter((s) => s.result === "WON").length;
  const lost = subs.filter((s) => s.result === "LOST").length;

  const sel: React.CSSProperties = { padding: "7px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 12, color: "var(--p-text)" };

  return (
    <div>
      <TopBar title="Suivi des soumissions" subtitle="Déclarez vos dépôts de dossiers et leurs résultats" />

      {subs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Total soumissions", value: subs.length, color: "var(--p-text)" },
            { label: "Marchés remportés", value: won,  color: "var(--p-green)" },
            { label: "Marchés perdus",    value: lost, color: "var(--p-red)" },
          ].map((k) => (
            <div key={k.label} style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 8, padding: "14px 18px" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".8px", color: "var(--p-muted)", marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontFamily: "var(--p-font-mono)", fontSize: 30, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && subs.length === 0 && (
        <AlertBanner variant="info">
          Aucune soumission déclarée. Ouvrez une fiche opportunité et cliquez sur &quot;Déclarer un dossier&quot; pour commencer le suivi.
        </AlertBanner>
      )}

      {loading ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : (
        subs.map((sub) => (
          <div key={sub.id} style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--p-text)", marginBottom: 4 }}>{sub.opportunityTitle}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#79b8ff" }}>{sub.funder}</span>
                  <StatusPill status={sub.status} />
                  {sub.result && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: RESULT_LABELS[sub.result]?.color ?? "var(--p-muted)" }}>
                      {RESULT_LABELS[sub.result]?.label ?? sub.result}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "var(--p-dim)" }}>
                    Déclaré le {new Date(sub.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {sub.notes && <div style={{ fontSize: 12, color: "var(--p-muted)", marginTop: 6 }}>{sub.notes}</div>}
                {sub.proofUrl && (
                  <a href={sub.proofUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--p-gold)", marginTop: 4, display: "inline-block" }}>
                    ↗ Justificatif
                  </a>
                )}
              </div>
              <button
                onClick={() => openEdit(sub)}
                style={{ padding: "5px 12px", fontSize: 11, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 5, color: "var(--p-gold)", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Mettre à jour
              </button>
            </div>

            {editId === sub.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid var(--p-border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Statut</label>
                  <select value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))} style={sel}>
                    <option value="PREPARING">En préparation</option>
                    <option value="SUBMITTED">Dossier soumis</option>
                    <option value="CLOSED">Clôturé</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Résultat</label>
                  <select value={editForm.result} onChange={(e) => setEditForm((f) => ({ ...f, result: e.target.value }))} style={sel}>
                    <option value="PENDING">En attente de résultat</option>
                    <option value="WON">Marché remporté ✓</option>
                    <option value="LOST">Marché perdu</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Notes</label>
                  <input value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} style={{ ...sel, width: "100%", boxSizing: "border-box" }} placeholder="Commentaires..." />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Lien justificatif (URL)</label>
                  <input value={editForm.proofUrl} onChange={(e) => setEditForm((f) => ({ ...f, proofUrl: e.target.value }))} style={{ ...sel, width: "100%", boxSizing: "border-box" }} placeholder="https://..." />
                </div>
                <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
                  <button onClick={saveEdit} disabled={updating === sub.id} style={{ padding: "7px 14px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}>
                    {updating === sub.id ? "Enregistrement…" : "Enregistrer"}
                  </button>
                  <button onClick={() => setEditId(null)} style={{ padding: "7px 12px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
