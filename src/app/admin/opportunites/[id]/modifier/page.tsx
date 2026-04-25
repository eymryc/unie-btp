"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/platform/TopBar";

const FUNDERS = ["BAD", "Banque Mondiale", "AFD", "Ministère", "Autre"];
const SECTORS = ["BTP – Routes", "Bâtiment", "Hydraulique", "Énergie", "Génie Civil", "Autre"];
const COMPLEXITIES = [
  { value: "ACCESSIBLE", label: "Accessible seul" },
  { value: "GROUPEMENT", label: "Groupement conseillé" },
  { value: "CONSORTIUM", label: "Consortium requis" },
];

export default function ModifierOpportunitePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Record<string, string | boolean> | null>(null);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm({
          title: d.title ?? "",
          description: d.description ?? "",
          funder: d.funder ?? FUNDERS[0],
          sector: d.sector ?? SECTORS[0],
          complexity: d.complexity ?? "ACCESSIBLE",
          location: d.location ?? "",
          budget: d.budget ?? "",
          closingDate: d.closingDate ? d.closingDate.split("T")[0] : "",
          requirements: Array.isArray(d.requirements) ? d.requirements.join("\n") : "",
          strategicAdvice: d.strategicAdvice ?? "",
          requiredDocs: Array.isArray(d.requiredDocs) ? d.requiredDocs.join("\n") : "",
          isPublished: d.isPublished ?? false,
        });
      });
  }, [id]);

  const set = (key: string, val: string | boolean) => setForm((f) => f ? { ...f, [key]: val } : f);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const res = await fetch(`/api/opportunities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        requirements: form.requirements ? (form.requirements as string).split("\n").filter(Boolean) : [],
        requiredDocs: form.requiredDocs ? (form.requiredDocs as string).split("\n").filter(Boolean) : [],
      }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/opportunites");
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur serveur.");
    }
  }

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--p-muted)", marginBottom: 5 };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 13, color: "var(--p-text)", boxSizing: "border-box" };

  if (!form) return <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>;

  return (
    <div>
      <TopBar title="Modifier l'opportunité" />
      {error && <div style={{ marginBottom: 14, padding: "9px 14px", background: "rgba(248,81,73,.1)", border: "0.5px solid rgba(248,81,73,.3)", borderRadius: 7, fontSize: 12, color: "#f08080" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Titre *</label>
            <input value={form.title as string} onChange={(e) => set("title", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Bailleur</label>
            <select value={form.funder as string} onChange={(e) => set("funder", e.target.value)} style={inputStyle}>
              {FUNDERS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Secteur</label>
            <select value={form.sector as string} onChange={(e) => set("sector", e.target.value)} style={inputStyle}>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Complexité</label>
            <select value={form.complexity as string} onChange={(e) => set("complexity", e.target.value)} style={inputStyle}>
              {COMPLEXITIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date de clôture</label>
            <input type="date" value={form.closingDate as string} onChange={(e) => set("closingDate", e.target.value)} style={inputStyle} />
          </div>
          <div><label style={labelStyle}>Localisation</label><input value={form.location as string} onChange={(e) => set("location", e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>Budget</label><input value={form.budget as string} onChange={(e) => set("budget", e.target.value)} style={inputStyle} /></div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description as string} onChange={(e) => set("description", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>Critères d'éligibilité (1 par ligne)</label>
            <textarea value={form.requirements as string} onChange={(e) => set("requirements", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>Documents requis (1 par ligne)</label>
            <textarea value={form.requiredDocs as string} onChange={(e) => set("requiredDocs", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Recommandation stratégique</label>
            <textarea value={form.strategicAdvice as string} onChange={(e) => set("strategicAdvice", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" checked={form.isPublished as boolean} onChange={(e) => set("isPublished", e.target.checked)} style={{ width: 14, height: 14 }} />
            <label style={{ fontSize: 13, color: "var(--p-text)", cursor: "pointer" }}>Publié aux membres</label>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving} style={{ padding: "10px 20px", fontSize: 13, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            {saving ? "Enregistrement…" : "Mettre à jour"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ padding: "10px 16px", fontSize: 13, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
