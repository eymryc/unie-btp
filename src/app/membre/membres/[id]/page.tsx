"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface PublicProfile {
  name: string; sector: string; city: string; country: string;
  specialties: string | null; equipment: string | null; employees: number | null;
  geographicZone: string | null; description: string | null;
  availability: string | null; availabilityNote: string | null;
  references: { title: string; client: string; year: string; amount?: string }[];
  foundingDate: string;
  documents: { id: string; name: string; fileName: string | null; fileUrl: string | null }[];
}

const AVAILABILITY_LABELS: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: "Disponible pour de nouveaux marchés", color: "#6dd49a" },
  PARTIAL:   { label: "Partiellement disponible",            color: "#e8b86d" },
  BUSY:      { label: "Actuellement occupé",                 color: "#f08080" },
};

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);

  useEffect(() => {
    fetch(`/api/members/${id}/public`).then((r) => r.json()).then(setProfile);
  }, [id]);

  if (!profile) return <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>;

  const avail = profile.availability ? AVAILABILITY_LABELS[profile.availability] : null;

  const card = (title: string, children: React.ReactNode) => (
    <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 18, marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-gold)", marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div>
      <button onClick={() => router.back()} style={{ fontSize: 12, color: "var(--p-muted)", background: "none", border: "none", cursor: "pointer", padding: "0 0 14px", display: "flex", alignItems: "center", gap: 5 }}>
        ← Retour à l'annuaire
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--p-gold-dim)", border: "1px solid var(--p-border2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--p-font-mono)", fontSize: 24, color: "var(--p-gold)", flexShrink: 0 }}>
          {profile.name.charAt(0)}
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--p-font-display)", fontSize: 24, fontWeight: 600, color: "var(--p-text)", margin: 0 }}>{profile.name}</h1>
          <div style={{ fontSize: 12, color: "var(--p-muted)", marginTop: 3 }}>{profile.sector} · {profile.city}, {profile.country} · Fondée en {profile.foundingDate}</div>
          {avail && (
            <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 20, background: `${avail.color}18`, color: avail.color, border: `0.5px solid ${avail.color}44`, fontSize: 11 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: avail.color }} />
              {avail.label}
            </div>
          )}
        </div>
      </div>

      {/* État vide — profil non encore complété */}
      {!profile.description && !profile.specialties && !profile.employees && !profile.references.length && !profile.equipment && (
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: "32px 24px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8, opacity: .3 }}>◻</div>
          <div style={{ fontSize: 13, color: "var(--p-muted)", marginBottom: 4 }}>Profil en cours de complétion</div>
          <p style={{ fontSize: 12, color: "var(--p-dim)", maxWidth: 360, margin: "0 auto" }}>
            Ce membre n'a pas encore renseigné ses capacités techniques, spécialités ou références projets.
          </p>
        </div>
      )}

      {profile.description && card("Présentation", (
        <p style={{ fontSize: 13, color: "var(--p-text)", lineHeight: 1.7, margin: 0 }}>{profile.description}</p>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {profile.specialties && card("Spécialités", (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {profile.specialties.split(",").map((s) => (
              <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(237,97,32,.1)", color: "var(--p-gold)", border: "0.5px solid rgba(237,97,32,.25)" }}>{s.trim()}</span>
            ))}
          </div>
        ))}

        {(profile.employees || profile.geographicZone || profile.equipment) && card("Capacités", (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
            {profile.employees && <div style={{ color: "var(--p-muted)" }}>Effectif : <strong style={{ color: "var(--p-text)" }}>{profile.employees} employés</strong></div>}
            {profile.geographicZone && <div style={{ color: "var(--p-muted)" }}>Zone : <strong style={{ color: "var(--p-text)" }}>{profile.geographicZone}</strong></div>}
            {profile.equipment && <div style={{ color: "var(--p-muted)" }}>Équipements : <strong style={{ color: "var(--p-text)" }}>{profile.equipment}</strong></div>}
          </div>
        ))}
      </div>

      {profile.availabilityNote && card("Note de disponibilité", (
        <p style={{ fontSize: 12, color: "var(--p-muted)", margin: 0 }}>{profile.availabilityNote}</p>
      ))}

      {profile.references.length > 0 && card("Références projets", (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {profile.references.map((ref, i) => (
            <div key={i} style={{ padding: "10px 12px", background: "var(--p-surface2)", borderRadius: 7, borderLeft: "2px solid var(--p-border2)" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)" }}>{ref.title}</div>
              <div style={{ fontSize: 11, color: "var(--p-muted)", marginTop: 2 }}>
                {ref.client} · {ref.year} {ref.amount ? `· ${ref.amount}` : ""}
              </div>
            </div>
          ))}
        </div>
      ))}

      {profile.documents.length > 0 && card("Documents disponibles", (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {profile.documents.map((doc) => (
            <a key={doc.id} href={doc.fileUrl ?? "#"} target="_blank" rel="noopener noreferrer"
               style={{ fontSize: 12, color: "var(--p-gold)", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              ↗ {doc.name}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
