"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";

interface TrainingSession {
  id: string;
  title: string;
  details: string;
  accentColor: string | null;
  signupUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "",
  details: "",
  accentColor: "",
  signupUrl: "",
  isPublished: true,
};

export default function AdminFormationsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/training-sessions")
      .then((r) => r.json())
      .then((d) => {
        setSessions(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => {
        setSessions([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    if (!form.title.trim() || !form.details.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      details: form.details.trim(),
      accentColor: form.accentColor.trim() || null,
      signupUrl: form.signupUrl.trim() || null,
      isPublished: form.isPublished,
    };

    if (editId) {
      await fetch(`/api/training-sessions/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/training-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette session ?")) return;
    await fetch(`/api/training-sessions/${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(s: TrainingSession) {
    await fetch(`/api/training-sessions/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...s, isPublished: !s.isPublished }),
    });
    load();
  }

  function openEdit(s: TrainingSession) {
    setForm({
      title: s.title,
      details: s.details,
      accentColor: s.accentColor ?? "",
      signupUrl: s.signupUrl ?? "",
      isPublished: s.isPublished,
    });
    setEditId(s.id);
    setShowForm(true);
  }

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    background: "var(--p-surface2)",
    border: "0.5px solid var(--p-border)",
    borderRadius: 6,
    fontSize: 13,
    color: "var(--p-text)",
    boxSizing: "border-box",
  };

  return (
    <div>
      <TopBar
        title="Formations & Sessions"
        subtitle={`${sessions.length} session${sessions.length !== 1 ? "s" : ""} au total`}
        action={
          <button
            onClick={() => {
              setForm(emptyForm);
              setEditId(null);
              setShowForm(true);
            }}
            style={{
              padding: "7px 14px",
              fontSize: 12,
              background: "var(--p-gold)",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            + Nouvelle session
          </button>
        }
      />

      {showForm && (
        <div
          style={{
            background: "var(--p-surface)",
            border: "0.5px solid var(--p-border2)",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-gold)", marginBottom: 14 }}>
            {editId ? "Modifier la session" : "Nouvelle session"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>
                Titre *
              </label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={inp} placeholder="Ex: Processus appels d'offres BAD" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>
                Détails *
              </label>
              <input value={form.details} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} style={inp} placeholder="Ex: 14 mai 2025 · 9h · Présentiel Abidjan" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>
                Couleur (optionnel)
              </label>
              <input value={form.accentColor} onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))} style={inp} placeholder='Ex: "#6dd49a" ou "var(--p-muted)"' />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>
                Lien d'inscription (optionnel)
              </label>
              <input value={form.signupUrl} onChange={(e) => setForm((f) => ({ ...f, signupUrl: e.target.value }))} style={inp} placeholder="https://..." />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
              <label style={{ fontSize: 13, color: "var(--p-text)", cursor: "pointer" }}>Publié (visible par les membres)</label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: "7px 16px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}
            >
              {saving ? "Enregistrement…" : editId ? "Mettre à jour" : "Créer la session"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              style={{ padding: "7px 12px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : sessions.length === 0 ? (
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: "40px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>◈</div>
          <div style={{ fontSize: 14, color: "var(--p-muted)", marginBottom: 6 }}>Aucune session créée</div>
          <p style={{ fontSize: 12, color: "var(--p-dim)", marginBottom: 16 }}>Créez des sessions de formation, webinaires ou accompagnements pour les membres.</p>
          <button
            onClick={() => setShowForm(true)}
            style={{ padding: "8px 16px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}
          >
            + Créer la première session
          </button>
        </div>
      ) : (
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, overflow: "hidden" }}>
          {sessions.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < sessions.length - 1 ? "0.5px solid var(--p-border)" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--p-text)" }}>{s.title}</div>
                <div style={{ fontSize: 11, color: s.accentColor ?? "var(--p-muted)", marginTop: 2 }}>{s.details}</div>
                {s.signupUrl && <div style={{ fontSize: 10, color: "var(--p-gold)", marginTop: 2 }}>↗ Lien d'inscription défini</div>}
              </div>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: s.isPublished ? "rgba(61,168,98,.12)" : "rgba(139,148,158,.1)",
                  color: s.isPublished ? "#6dd49a" : "var(--p-dim)",
                  border: `0.5px solid ${s.isPublished ? "rgba(61,168,98,.3)" : "rgba(139,148,158,.2)"}`,
                }}
              >
                {s.isPublished ? "Publié" : "Masqué"}
              </span>
              <div style={{ display: "flex", gap: 5 }}>
                <button
                  onClick={() => togglePublish(s)}
                  style={{ padding: "3px 8px", fontSize: 10, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 4, color: "var(--p-muted)", cursor: "pointer" }}
                >
                  {s.isPublished ? "Masquer" : "Publier"}
                </button>
                <button
                  onClick={() => openEdit(s)}
                  style={{ padding: "3px 8px", fontSize: 10, background: "rgba(237,97,32,.1)", border: "0.5px solid rgba(237,97,32,.25)", borderRadius: 4, color: "var(--p-gold)", cursor: "pointer" }}
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  style={{ padding: "3px 8px", fontSize: 10, background: "rgba(248,81,73,.08)", border: "0.5px solid rgba(248,81,73,.2)", borderRadius: 4, color: "#f08080", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

