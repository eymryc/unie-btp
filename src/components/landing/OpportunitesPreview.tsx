"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OppPreview {
  id: string; title: string; funder: string; sector: string;
  complexity: string; closingDate: string; budget: string | null; interestCount: number;
}

const COMPLEXITY_COLORS: Record<string, string> = {
  ACCESSIBLE: "#3da862",
  GROUPEMENT: "#d29922",
  CONSORTIUM: "#e05050",
};
const COMPLEXITY_LABELS: Record<string, string> = {
  ACCESSIBLE: "Accessible seul",
  GROUPEMENT: "Groupement conseillé",
  CONSORTIUM: "Consortium requis",
};

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function OpportunitesPreview() {
  const router = useRouter();
  const [opps, setOpps] = useState<OppPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/opportunities")
      .then((r) => r.json())
      .then((d) => { setOpps(d); setLoading(false); });
  }, []);

  return (
    <section id="opportunites" style={{ padding: "96px 0", background: "var(--night-2, #0b1224)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1.5, background: "var(--primary, #ed6120)" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--primary, #ed6120)" }}>
              Opportunités actives
            </span>
            <div style={{ width: 28, height: 1.5, background: "var(--primary, #ed6120)" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(30px,4vw,48px)", fontWeight: 600, color: "#e8e4dc", margin: "0 0 14px", lineHeight: 1.15 }}>
            Marchés disponibles en ce moment
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,.45)", maxWidth: 520, margin: "0 auto" }}>
            Aperçu des appels d'offres publiés. Les membres actifs accèdent aux fiches complètes, critères d'éligibilité et analyses stratégiques.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: 13 }}>Chargement…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 40 }}>
            {opps.map((opp) => {
              const days = daysUntil(opp.closingDate);
              const dotColor = COMPLEXITY_COLORS[opp.complexity] ?? "#7a8590";
              return (
                <div
                  key={opp.id}
                  style={{
                    background: "rgba(255,255,255,.04)",
                    border: "0.5px solid rgba(237,97,32,.16)",
                    borderRadius: 10,
                    padding: 20,
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color .2s, transform .2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(237,97,32,.4)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(237,97,32,.16)";
                    (e.currentTarget as HTMLElement).style.transform = "none";
                  }}
                >
                  {/* Complexity dot + funder */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, display: "inline-block", boxShadow: `0 0 6px ${dotColor}66` }} />
                    <span style={{ fontSize: 10, color: dotColor, fontFamily: "'DM Sans', sans-serif", letterSpacing: ".06em" }}>{COMPLEXITY_LABELS[opp.complexity]}</span>
                  </div>

                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#e8e4dc", lineHeight: 1.4, marginBottom: 10 }}>
                    {opp.title}
                  </div>

                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(42,127,204,.12)", color: "#6eb3e8", border: "0.5px solid rgba(42,127,204,.25)" }}>{opp.funder}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(61,168,98,.08)", color: "#6dd49a", border: "0.5px solid rgba(61,168,98,.22)" }}>{opp.sector}</span>
                    {opp.budget && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(237,97,32,.08)", color: "#ed6120" }}>{opp.budget}</span>}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 11, color: days <= 10 ? "#f08080" : "rgba(255,255,255,.3)" }}>
                      {days <= 0 ? "Clôturé" : `Clôture dans ${days} j`}
                    </div>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,.2)" }}>{opp.interestCount} intéressé{opp.interestCount !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Overlay flou — accès réservé membres */}
                  <div style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: 40,
                    background: "linear-gradient(transparent, rgba(11,18,36,.9))",
                    display: "flex",
                    alignItems: "flex-end",
                    paddingBottom: 8,
                    paddingLeft: 12,
                  }}>
                    <span style={{ fontSize: 10, color: "rgba(237,97,32,.7)", fontFamily: "'DM Sans', sans-serif", letterSpacing: ".06em" }}>
                      🔒 Fiche complète réservée aux membres
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => router.push("/login")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "13px 32px", background: "var(--primary, #ed6120)",
              border: "none", borderRadius: 8, fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
              color: "#fff", cursor: "pointer",
              boxShadow: "0 8px 28px rgba(237,97,32,.4)",
            }}
          >
            <span>Accéder à toutes les opportunités</span>
            <span>→</span>
          </button>
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,.3)", fontFamily: "'DM Sans', sans-serif" }}>
            Accès réservé aux membres actifs UNIE BTP
          </div>
        </div>
      </div>
    </section>
  );
}
