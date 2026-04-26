"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";
import DataTable, { Column } from "@/components/platform/DataTable";

interface Guide {
  id: string; title: string; description: string | null;
  category: string; fileUrl: string | null; isPublished: boolean; createdAt: string;
}

const CATEGORIES = ["checklist", "modele", "guide", "formation"];
const CAT_LABELS: Record<string, string> = {
  checklist: "Checklist", modele: "Modèle", guide: "Guide", formation: "Formation",
};

const emptyForm = { title: "", description: "", category: "guide", fileUrl: "", isPublished: true };

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/guides").then((r) => r.json()).then((d) => { setGuides(d); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.title) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/guides/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/guides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce guide ?")) return;
    await fetch(`/api/guides/${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(g: Guide) {
    await fetch(`/api/guides/${g.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...g, isPublished: !g.isPublished }),
    });
    load();
  }

  function openEdit(g: Guide) {
    setForm({ title: g.title, description: g.description ?? "", category: g.category, fileUrl: g.fileUrl ?? "", isPublished: g.isPublished });
    setEditId(g.id);
    setShowForm(true);
  }

  const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 13, color: "var(--p-text)", boxSizing: "border-box" };

  const columns: Column<Guide>[] = [
    {
      key: "title",
      header: "Ressource",
      render: (g) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-text)" }}>{g.title}</div>
          {g.description && <div style={{ fontSize: 11, color: "var(--p-muted)", marginTop: 2 }}>{g.description}</div>}
          {g.fileUrl && <div style={{ fontSize: 10, color: "var(--p-gold)", marginTop: 2 }}>↗ Lien fichier défini</div>}
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      width: 140,
      render: (g) => (
        <span style={{ fontSize: 11, color: "var(--p-muted)" }}>
          {CAT_LABELS[g.category] ?? g.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      width: 100,
      render: (g) => (
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 10,
            background: g.isPublished ? "rgba(61,168,98,.12)" : "rgba(139,148,158,.1)",
            color: g.isPublished ? "#6dd49a" : "var(--p-dim)",
            border: `0.5px solid ${g.isPublished ? "rgba(61,168,98,.3)" : "rgba(139,148,158,.2)"}`,
          }}
        >
          {g.isPublished ? "Publié" : "Masqué"}
        </span>
      ),
    },
    {
      key: "file",
      header: "Fichier",
      width: 120,
      render: (g) => (
        <button
          onClick={() => g.fileUrl ? window.open(g.fileUrl, "_blank") : alert("Aucun lien de fichier défini.")}
          style={{
            padding: "4px 8px",
            fontSize: 10,
            background: g.fileUrl ? "rgba(237,97,32,.10)" : "transparent",
            border: "0.5px solid",
            borderColor: g.fileUrl ? "rgba(237,97,32,.25)" : "var(--p-border)",
            borderRadius: 6,
            color: g.fileUrl ? "var(--p-gold)" : "var(--p-dim)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {g.fileUrl ? "Ouvrir ↗" : "—"}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: 190,
      render: (g) => (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => togglePublish(g)}
            style={{
              padding: "4px 8px",
              fontSize: 10,
              background: "transparent",
              border: "0.5px solid var(--p-border)",
              borderRadius: 6,
              color: "var(--p-muted)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {g.isPublished ? "Masquer" : "Publier"}
          </button>
          <button
            onClick={() => openEdit(g)}
            style={{
              padding: "4px 8px",
              fontSize: 10,
              background: "rgba(237,97,32,.1)",
              border: "0.5px solid rgba(237,97,32,.25)",
              borderRadius: 6,
              color: "var(--p-gold)",
              cursor: "pointer",
            }}
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(g.id)}
            style={{
              padding: "4px 8px",
              fontSize: 10,
              background: "rgba(248,81,73,.08)",
              border: "0.5px solid rgba(248,81,73,.2)",
              borderRadius: 6,
              color: "#f08080",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TopBar
        title="Outils & Guides"
        subtitle={`${guides.length} ressource${guides.length !== 1 ? "s" : ""} au total`}
        action={
          <button
            onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
            style={{ padding: "7px 14px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 700 }}
          >
            + Nouveau guide
          </button>
        }
      />

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border2)", borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-gold)", marginBottom: 14 }}>
            {editId ? "Modifier le guide" : "Nouveau guide / ressource"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Titre *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={inp} placeholder="Ex: Checklist de soumission BAD" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Catégorie</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Description</label>
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={inp} placeholder="Brève description de la ressource" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 5 }}>Lien du fichier (URL)</label>
              <input value={form.fileUrl} onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))} style={inp} placeholder="https://... (Google Drive, Dropbox, etc.)" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
              <label style={{ fontSize: 13, color: "var(--p-text)", cursor: "pointer" }}>Publié (visible par les membres)</label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: "7px 16px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}>
              {saving ? "Enregistrement…" : editId ? "Mettre à jour" : "Créer la ressource"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ padding: "7px 12px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : guides.length === 0 ? (
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: "40px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: .3 }}>⊡</div>
          <div style={{ fontSize: 14, color: "var(--p-muted)", marginBottom: 6 }}>Aucune ressource créée</div>
          <p style={{ fontSize: 12, color: "var(--p-dim)", marginBottom: 16 }}>Ajoutez des checklists, modèles et guides pour aider les membres à préparer leurs dossiers.</p>
          <button onClick={() => setShowForm(true)} style={{ padding: "8px 16px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}>
            + Créer le premier guide
          </button>
        </div>
      ) : (
        <DataTable<Guide>
          columns={columns}
          data={guides}
          loading={loading}
          searchPlaceholder="Rechercher par titre, catégorie…"
          searchFn={(g, q) => [g.title, g.description ?? "", g.category].some((v) => v?.toLowerCase().includes(q))}
          pageSize={10}
          emptyMessage="Aucune ressource."
          getRowKey={(g) => g.id}
        />
      )}
    </div>
  );
}
