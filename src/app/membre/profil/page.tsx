"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";
import StatusPill from "@/components/platform/StatusPill";

interface Profile {
  id: string; name: string; registrationNumber: string; taxId: string; sector: string;
  foundingDate: string; email: string; phone: string; website: string | null;
  address: string; city: string; country: string; ceoName: string;
  ceoEmail: string; ceoPhone: string; specialties: string | null;
  equipment: string | null; employees: number | null; geographicZone: string | null;
  description: string | null; subscriptionStatus: string; subscriptionExpiry: string | null;
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saved, setSaved] = useState(false);

  function load() {
    fetch("/api/profile").then((r) => r.json()).then((d) => {
      setProfile(d);
      setForm(d);
    });
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEditing(false);
    setSaved(true);
    load();
    setTimeout(() => setSaved(false), 3000);
  }

  const field = (label: string, key: keyof Profile, type = "text", multiline = false) => (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--p-muted)", marginBottom: 5 }}>{label}</label>
      {!editing ? (
        <div style={{ fontSize: 13, color: "var(--p-text)", padding: "8px 0", borderBottom: "0.5px solid var(--p-border)" }}>
          {(profile as unknown as Record<string, unknown>)?.[key] as string ?? <span style={{ color: "var(--p-dim)" }}>—</span>}
        </div>
      ) : multiline ? (
        <textarea
          value={(form as Record<string, unknown>)[key] as string ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={3}
          style={{ width: "100%", padding: "8px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 13, color: "var(--p-text)", resize: "vertical", boxSizing: "border-box" }}
        />
      ) : (
        <input
          type={type}
          value={(form as Record<string, unknown>)[key] as string ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          style={{ width: "100%", padding: "8px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 13, color: "var(--p-text)", boxSizing: "border-box" }}
        />
      )}
    </div>
  );

  return (
    <div>
      <TopBar
        title="Mon profil entreprise"
        subtitle="Informations de votre entreprise sur la plateforme"
        action={
          !editing ? (
            <button onClick={() => setEditing(true)} style={{ padding: "7px 14px", fontSize: 12, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer" }}>
              Modifier le profil
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setEditing(false); setForm(profile ?? {}); }} style={{ padding: "7px 12px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", cursor: "pointer" }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "7px 14px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          )
        }
      />

      {saved && (
        <div style={{ marginBottom: 14, padding: "9px 14px", background: "rgba(46,160,67,.1)", border: "0.5px solid rgba(46,160,67,.3)", borderRadius: 7, fontSize: 12, color: "#6dd49a" }}>
          ✓ Profil mis à jour avec succès.
        </div>
      )}

      {!profile ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : (
        <>
          {/* Statut abonnement */}
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--p-muted)", marginBottom: 4 }}>Statut d'abonnement</div>
              <StatusPill status={profile.subscriptionStatus} />
            </div>
            {profile.subscriptionExpiry && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--p-muted)" }}>Expiration</div>
                <div style={{ fontSize: 13, color: "var(--p-text)" }}>{new Date(profile.subscriptionExpiry).toLocaleDateString("fr-FR")}</div>
              </div>
            )}
            {profile.subscriptionStatus !== "ACTIVE" && (
              <div style={{ fontSize: 12, color: "#f08080", padding: "8px 12px", background: "rgba(248,81,73,.08)", borderRadius: 6, border: "0.5px solid rgba(248,81,73,.25)" }}>
                {profile.subscriptionStatus === "PENDING" ? "En attente de validation par l'administration UNIE BTP" : "Accès suspendu — contactez l'administration"}
              </div>
            )}
          </div>

          {/* Informations générales (readonly) */}
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-gold)", marginBottom: 14 }}>Informations générales</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 4 }}>Raison sociale</div>
                <div style={{ fontSize: 13, color: "var(--p-text)" }}>{profile.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 4 }}>Secteur</div>
                <div style={{ fontSize: 13, color: "var(--p-text)" }}>{profile.sector}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 4 }}>N° d'enregistrement</div>
                <div style={{ fontSize: 13, color: "var(--p-text)" }}>{profile.registrationNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 4 }}>NIF</div>
                <div style={{ fontSize: 13, color: "var(--p-text)" }}>{profile.taxId}</div>
              </div>
            </div>
          </div>

          {/* Informations éditables */}
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-gold)", marginBottom: 14 }}>Contact & localisation</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {field("Téléphone", "phone", "tel")}
              {field("Site web", "website", "url")}
              {field("Adresse", "address")}
              {field("Ville", "city")}
            </div>
          </div>

          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-gold)", marginBottom: 14 }}>Capacités techniques</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {field("Spécialités", "specialties", "text", true)}
              {field("Équipements", "equipment", "text", true)}
              {field("Effectif (nb d'employés)", "employees", "number")}
              {field("Zone d'intervention géographique", "geographicZone")}
            </div>
            <div style={{ marginTop: 14 }}>
              {field("Description / Présentation", "description", "text", true)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
