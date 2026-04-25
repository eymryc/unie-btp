"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/platform/TopBar";

const FUNDERS = ["BAD", "Banque Mondiale", "AFD", "Ministère", "Autre"];
const SECTORS = ["BTP – Routes", "Bâtiment", "Hydraulique", "Énergie", "Génie Civil", "Autre"];
const COMPLEXITIES = [
  { value: "ACCESSIBLE", label: "Accessible seul" },
  { value: "GROUPEMENT", label: "Groupement conseillé" },
  { value: "CONSORTIUM", label: "Consortium requis" },
];

export default function NouvelleOpportunitePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", funder: FUNDERS[0], sector: SECTORS[0],
    complexity: "ACCESSIBLE", location: "", budget: "",
    closingDate: "", requirements: "", strategicAdvice: "", requiredDocs: "", isPublished: false,
  });

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.closingDate) {
      setError("Titre, description et date de clôture sont obligatoires.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        requirements: form.requirements ? form.requirements.split("\n").filter(Boolean) : [],
        requiredDocs: form.requiredDocs ? form.requiredDocs.split("\n").filter(Boolean) : [],
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
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

  return (
    <div>
      <TopBar title="Nouvelle opportunité" subtitle="Créer et publier une fiche appel d'offres" />

      {error && (
        <div style={{ marginBottom: 14, padding: "9px 14px", background: "rgba(248,81,73,.1)", border: "0.5px solid rgba(248,81,73,.3)", borderRadius: 7, fontSize: 12, color: "#f08080" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Titre du marché *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} style={inputStyle} placeholder="Ex: Réhabilitation routes rurales – Région des Lacs" />
          </div>
          <div>
            <label style={labelStyle}>Bailleur *</label>
            <select value={form.funder} onChange={(e) => set("funder", e.target.value)} style={selectStyle}>
              {FUNDERS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Secteur *</label>
            <select value={form.sector} onChange={(e) => set("sector", e.target.value)} style={selectStyle}>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Complexité *</label>
            <select value={form.complexity} onChange={(e) => set("complexity", e.target.value)} style={selectStyle}>
              {COMPLEXITIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date de clôture *</label>
            <input type="date" value={form.closingDate} onChange={(e) => set("closingDate", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Localisation</label>
            <input value={form.location} onChange={(e) => set("location", e.target.value)} style={inputStyle} placeholder="Ex: Abidjan, Côte d'Ivoire" />
          </div>
          <div>
            <label style={labelStyle}>Budget estimé</label>
            <input value={form.budget} onChange={(e) => set("budget", e.target.value)} style={inputStyle} placeholder="Ex: 2,4 Mds FCFA" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description *</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Description complète du projet et du marché…" />
          </div>
          <div>
            <label style={labelStyle}>Critères d'éligibilité (1 par ligne)</label>
            <textarea value={form.requirements} onChange={(e) => set("requirements", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder={"Expérience min. 3 projets similaires\nCapacité financière 500M FCFA\n..."} />
          </div>
          <div>
            <label style={labelStyle}>Documents requis (1 par ligne)</label>
            <textarea value={form.requiredDocs} onChange={(e) => set("requiredDocs", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder={"Dossier administratif complet\nOffre financière + BPU\n..."} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Recommandation stratégique MICENY</label>
            <textarea value={form.strategicAdvice} onChange={(e) => set("strategicAdvice", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Analyse stratégique et recommandation de positionnement…" />
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="published" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} style={{ width: 14, height: 14, cursor: "pointer" }} />
            <label htmlFor="published" style={{ fontSize: 13, color: "var(--p-text)", cursor: "pointer" }}>
              Publier immédiatement aux membres
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving} style={{ padding: "10px 20px", fontSize: 13, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            {saving ? "Enregistrement…" : form.isPublished ? "Publier l'opportunité" : "Enregistrer en brouillon"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ padding: "10px 16px", fontSize: 13, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
