"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function AttenteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const suspended = searchParams.get("suspended") === "1";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "40px 20px" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: suspended ? "rgba(224,80,80,.12)" : "rgba(237,97,32,.12)", border: `1px solid ${suspended ? "rgba(224,80,80,.3)" : "rgba(237,97,32,.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20 }}>
        {suspended ? "⊘" : "⏳"}
      </div>

      <h2 style={{ fontFamily: "var(--p-font-display)", fontSize: 26, fontWeight: 600, color: "var(--p-text)", margin: "0 0 10px" }}>
        {suspended ? "Accès suspendu" : "Compte en cours de validation"}
      </h2>

      <p style={{ fontSize: 13, color: "var(--p-muted)", maxWidth: 440, lineHeight: 1.7, margin: "0 0 24px" }}>
        {suspended
          ? "Votre accès à la plateforme a été suspendu. Contactez l'administration UNIE BTP pour régulariser votre situation."
          : "Votre dossier d'adhésion a bien été reçu. L'équipe UNIE BTP est en train de valider votre inscription. Vous recevrez une confirmation sous 48 heures ouvrables."}
      </p>

      {!suspended && (
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border2)", borderRadius: 10, padding: "16px 24px", marginBottom: 24, textAlign: "left", maxWidth: 400, width: "100%" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--p-gold)", marginBottom: 12 }}>Étapes de validation</div>
          {[
            ["✓", "Dossier reçu par UNIE BTP", true],
            ["⏳", "Vérification des informations (48h)", false],
            ["○", "Activation de votre accès", false],
            ["○", "Accès complet à la plateforme", false],
          ].map(([icon, label, done]) => (
            <div key={String(label)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 12, color: done ? "var(--p-green)" : "var(--p-muted)" }}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => router.push("/membre/profil")} style={{ padding: "9px 18px", fontSize: 12, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer", fontFamily: "var(--p-font-ui)" }}>
          Compléter mon profil
        </button>
        <a href="mailto:contact@unie-btp.com" style={{ padding: "9px 18px", fontSize: 12, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 6, color: "var(--p-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          Contacter l'administration
        </a>
      </div>
    </div>
  );
}

export default function AttentePage() {
  return <Suspense><AttenteContent /></Suspense>;
}
