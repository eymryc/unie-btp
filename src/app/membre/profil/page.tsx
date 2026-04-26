"use client";

import { useEffect, useState, useRef } from "react";
import TopBar from "@/components/platform/TopBar";
import StatusPill from "@/components/platform/StatusPill";
import AlertBanner from "@/components/platform/AlertBanner";

interface Doc { id: string; name: string; docType: string; fileName: string | null; fileUrl: string | null; createdAt: string; }
interface Ref  { title: string; client: string; year: string; amount?: string; }
interface Profile {
  id: string; name: string; registrationNumber: string; taxId: string; sector: string; foundingDate: string;
  email: string; phone: string; website: string | null; address: string; city: string; country: string;
  ceoName: string; ceoEmail: string; ceoPhone: string; specialties: string | null; equipment: string | null;
  employees: number | null; geographicZone: string | null; description: string | null;
  availability: string | null; availabilityNote: string | null;
  references: Ref[]; subscriptionStatus: string; subscriptionExpiry: string | null;
  documents: Doc[];
}

const DOC_LABELS: Record<string, string> = {
  registre_commerce: "Registre de commerce",
  reference_projet:  "Référence projet",
  attestation:       "Attestation",
  autre:             "Autre document",
};

export default function ProfilPage() {
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [form, setForm]         = useState<Partial<Profile & { referencesRaw: Ref[] }>>({});
  const [newRef, setNewRef]     = useState<Ref>({ title: "", client: "", year: "", amount: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("registre_commerce");
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/profile").then((r) => r.json()).then((d) => {
      setProfile(d);
      setForm({ ...d, referencesRaw: d.references ?? [] });
    });
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, references: form.referencesRaw }),
    });
    setSaving(false);
    setEditing(false);
    setSaved(true);
    load();
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleUpload() {
    if (!fileRef.current?.files?.[0]) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", fileRef.current.files[0]);
    fd.append("docType", uploadType);
    fd.append("name", uploadName || fileRef.current.files[0].name);
    await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    setUploadName("");
    if (fileRef.current) fileRef.current.value = "";
    load();
  }

  async function deleteDoc(id: string) {
    await fetch("/api/profile/documents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function addRef() {
    if (!newRef.title || !newRef.client) return;
    setForm((f) => ({ ...f, referencesRaw: [...(f.referencesRaw ?? []), newRef] }));
    setNewRef({ title: "", client: "", year: "", amount: "" });
  }

  function removeRef(i: number) {
    setForm((f) => ({ ...f, referencesRaw: (f.referencesRaw ?? []).filter((_, idx) => idx !== i) }));
  }

  const inp: React.CSSProperties = { width: "100%", padding: "9px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 13, color: "var(--p-text)", boxSizing: "border-box" };
  const lbl = (label: string) => <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--p-muted)", marginBottom: 5 }}>{label}</label>;
  const row = (label: string, value: string | number | null | undefined) => (
    <div style={{ padding: "8px 0", borderBottom: "0.5px solid var(--p-border)", fontSize: 12 }}>
      <span style={{ color: "var(--p-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
      <div style={{ color: "var(--p-text)", marginTop: 2 }}>{value ?? <span style={{ color: "var(--p-dim)" }}>—</span>}</div>
    </div>
  );

  if (!profile) return <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>;

  return (
    <div>
      <TopBar
        title="Mon profil entreprise"
        subtitle="Informations visibles par les autres membres"
        action={!editing ? (
          <button onClick={() => setEditing(true)} style={{ padding: "7px 14px", fontSize: 12, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer" }}>
            Modifier le profil
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setEditing(false); setForm({ ...profile, referencesRaw: profile.references }); }} style={{ padding: "7px 12px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>Annuler</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: "7px 16px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 700 }}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        )}
      />

      {saved && <AlertBanner variant="success">Profil mis à jour avec succès.</AlertBanner>}

      {/* Statut abonnement */}
      <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--p-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".08em" }}>Statut d'abonnement</div>
          <StatusPill status={profile.subscriptionStatus} />
        </div>
        {profile.subscriptionExpiry && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--p-muted)" }}>Expiration</div>
            <div style={{ fontSize: 13, color: "var(--p-text)" }}>{new Date(profile.subscriptionExpiry).toLocaleDateString("fr-FR")}</div>
          </div>
        )}
        {profile.subscriptionStatus !== "ACTIVE" && (
          <div style={{ fontSize: 12, color: "#e8b86d", padding: "8px 12px", background: "rgba(210,153,34,.08)", borderRadius: 6, border: "0.5px solid rgba(210,153,34,.22)" }}>
            {profile.subscriptionStatus === "PENDING" ? "En attente de validation" : "Contactez l'administration"}
          </div>
        )}
      </div>

      {/* Infos générales (readonly) */}
      <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 14 }}>Informations générales</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
          {row("Raison sociale", profile.name)}
          {row("Secteur", profile.sector)}
          {row("N° enregistrement", profile.registrationNumber)}
          {row("NIF", profile.taxId)}
          {row("Date de création", profile.foundingDate)}
          {row("Pays", profile.country)}
        </div>
      </div>

      {/* Contact & localisation */}
      <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 14 }}>Contact & localisation</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {editing ? (
            <>
              <div>{lbl("Téléphone")}<input value={String(form.phone ?? "")} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={inp} /></div>
              <div>{lbl("Site web")}<input value={String(form.website ?? "")} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} style={inp} /></div>
              <div>{lbl("Adresse")}<input value={String(form.address ?? "")} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} style={inp} /></div>
              <div>{lbl("Ville")}<input value={String(form.city ?? "")} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} style={inp} /></div>
            </>
          ) : (
            <>
              {row("Téléphone", profile.phone)}
              {row("Site web", profile.website)}
              {row("Adresse", profile.address)}
              {row("Ville", profile.city)}
            </>
          )}
        </div>
      </div>

      {/* Disponibilité */}
      <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 14 }}>Disponibilité</div>
        {editing ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              {lbl("Statut de disponibilité")}
              <select value={form.availability ?? ""} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                <option value="">Non renseigné</option>
                <option value="AVAILABLE">Disponible pour de nouveaux marchés</option>
                <option value="PARTIAL">Partiellement disponible</option>
                <option value="BUSY">Actuellement occupé</option>
              </select>
            </div>
            <div>
              {lbl("Note de disponibilité")}
              <input value={String(form.availabilityNote ?? "")} onChange={(e) => setForm((f) => ({ ...f, availabilityNote: e.target.value }))} style={inp} placeholder="Ex: Disponible à partir de juillet…" />
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            {row("Statut", profile.availability === "AVAILABLE" ? "Disponible" : profile.availability === "PARTIAL" ? "Partiellement disponible" : profile.availability === "BUSY" ? "Occupé" : "Non renseigné")}
            {row("Note", profile.availabilityNote)}
          </div>
        )}
      </div>

      {/* Capacités techniques */}
      <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 14 }}>Capacités techniques</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {editing ? (
            <>
              <div style={{ gridColumn: "1/-1" }}>{lbl("Description / Présentation")}<textarea value={String(form.description ?? "")} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inp, resize: "vertical" }} /></div>
              <div style={{ gridColumn: "1/-1" }}>{lbl("Spécialités")}<textarea value={String(form.specialties ?? "")} onChange={(e) => setForm((f) => ({ ...f, specialties: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Ex: Terrassement, Routes en latérite, Drainage…" /></div>
              <div style={{ gridColumn: "1/-1" }}>{lbl("Équipements disponibles")}<textarea value={String(form.equipment ?? "")} onChange={(e) => setForm((f) => ({ ...f, equipment: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical" }} /></div>
              <div>{lbl("Effectif")}<input type="number" value={String(form.employees ?? "")} onChange={(e) => setForm((f) => ({ ...f, employees: Number(e.target.value) }))} style={inp} /></div>
              <div>{lbl("Zone géographique d'intervention")}<input value={String(form.geographicZone ?? "")} onChange={(e) => setForm((f) => ({ ...f, geographicZone: e.target.value }))} style={inp} /></div>
            </>
          ) : (
            <>
              <div style={{ gridColumn: "1/-1" }}>{row("Description", profile.description)}</div>
              <div style={{ gridColumn: "1/-1" }}>{row("Spécialités", profile.specialties)}</div>
              <div style={{ gridColumn: "1/-1" }}>{row("Équipements", profile.equipment)}</div>
              {row("Effectif", profile.employees ? `${profile.employees} employés` : null)}
              {row("Zone géographique", profile.geographicZone)}
            </>
          )}
        </div>
      </div>

      {/* Références projets */}
      <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 14 }}>
          Références projets ({editing ? (form.referencesRaw ?? []).length : profile.references.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(editing ? form.referencesRaw ?? [] : profile.references).map((ref, i) => (
            <div key={i} style={{ padding: "10px 14px", background: "var(--p-surface2)", borderRadius: 7, borderLeft: "2px solid var(--p-border2)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--p-text)" }}>{ref.title}</div>
                <div style={{ fontSize: 11, color: "var(--p-muted)", marginTop: 2 }}>{ref.client} · {ref.year} {ref.amount ? `· ${ref.amount}` : ""}</div>
              </div>
              {editing && (
                <button onClick={() => removeRef(i)} style={{ fontSize: 12, color: "#f08080", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>✕</button>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div style={{ marginTop: 12, padding: 12, background: "var(--p-surface2)", borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--p-muted)", marginBottom: 8 }}>Ajouter une référence</div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 100px 120px auto", gap: 8 }}>
              <input value={newRef.title} onChange={(e) => setNewRef((f) => ({ ...f, title: e.target.value }))} style={inp} placeholder="Titre du projet *" />
              <input value={newRef.client} onChange={(e) => setNewRef((f) => ({ ...f, client: e.target.value }))} style={inp} placeholder="Client / Maître d'ouvrage *" />
              <input value={newRef.year} onChange={(e) => setNewRef((f) => ({ ...f, year: e.target.value }))} style={inp} placeholder="Année" />
              <input value={newRef.amount ?? ""} onChange={(e) => setNewRef((f) => ({ ...f, amount: e.target.value }))} style={inp} placeholder="Montant" />
              <button onClick={addRef} style={{ padding: "0 14px", background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, cursor: "pointer", height: "36px" }}>+ Ajouter</button>
            </div>
          </div>
        )}
      </div>

      {/* Documents */}
      <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 14 }}>Documents justificatifs</div>

        {profile.documents.length === 0 ? (
          <div style={{ color: "var(--p-dim)", fontSize: 12, marginBottom: 14 }}>Aucun document uploadé.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {profile.documents.map((doc) => (
              <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--p-surface2)", borderRadius: 7 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)" }}>{doc.name}</div>
                  <div style={{ fontSize: 10, color: "var(--p-dim)" }}>{DOC_LABELS[doc.docType] ?? doc.docType} · {doc.fileName}</div>
                </div>
                {doc.fileUrl && <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--p-gold)", textDecoration: "none" }}>↗ Voir</a>}
                <button onClick={() => deleteDoc(doc.id)} style={{ fontSize: 12, color: "#f08080", background: "none", border: "none", cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: 12, background: "var(--p-surface2)", borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--p-muted)", marginBottom: 8 }}>Ajouter un document (max 5 Mo)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 8, marginBottom: 8 }}>
            <input value={uploadName} onChange={(e) => setUploadName(e.target.value)} style={inp} placeholder="Nom du document" />
            <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              <option value="registre_commerce">Registre de commerce</option>
              <option value="reference_projet">Référence projet</option>
              <option value="attestation">Attestation</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ fontSize: 12, color: "var(--p-muted)", flex: 1 }} />
            <button onClick={handleUpload} disabled={uploading} style={{ padding: "7px 14px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
              {uploading ? "Upload…" : "↑ Uploader"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
