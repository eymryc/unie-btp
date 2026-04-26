"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/platform/TopBar";
import ComplexityBadge from "@/components/platform/ComplexityBadge";

interface Opp {
  id: string; title: string; funder: string; sector: string;
  complexity: string; closingDate: string; budget: string | null;
  location: string | null; interestCount: number; isSaved: boolean; isInterested: boolean;
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

function urgencyColor(days: number) {
  if (days <= 0)  return "#7a8590";
  if (days <= 7)  return "#f08080";
  if (days <= 14) return "#e8b86d";
  return "#6dd49a";
}

export default function VeillePage() {
  const router = useRouter();
  const [opps, setOpps] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/opportunities")
      .then((r) => r.json())
      .then((d: Opp[]) => { setOpps(d); setLoading(false); });
  }, []);

  const now = new Date();
  const weekLabel = `Semaine du ${now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;

  // Grouper par statut d'urgence
  const urgent  = opps.filter((o) => { const d = daysUntil(o.closingDate); return d > 0 && d <= 10; });
  const active  = opps.filter((o) => { const d = daysUntil(o.closingDate); return d > 10; });
  const closed  = opps.filter((o) => daysUntil(o.closingDate) <= 0);

  function OppCard({ opp }: { opp: Opp }) {
    const days = daysUntil(opp.closingDate);
    return (
      <div
        onClick={() => router.push(`/membre/opportunites/${opp.id}`)}
        style={{ background: "var(--p-surface2)", border: `0.5px solid var(--p-border)`, borderLeft: `3px solid ${urgencyColor(days)}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer", transition: "border-color .15s, background .1s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--p-surface3)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--p-surface2)")}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1 }}>
            <div style={{ paddingTop: 3 }}><ComplexityBadge complexity={opp.complexity} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--p-text)", marginBottom: 4 }}>{opp.title}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(42,127,204,.1)", color: "#6eb3e8" }}>{opp.funder}</span>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(61,168,98,.08)", color: "#6dd49a" }}>{opp.sector}</span>
                {opp.budget && <span style={{ fontSize: 10, color: "var(--p-dim)" }}>{opp.budget}</span>}
                {opp.location && <span style={{ fontSize: 10, color: "var(--p-dim)" }}>📍 {opp.location}</span>}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--p-font-mono)", fontSize: 18, color: urgencyColor(days) }}>
              {days <= 0 ? "Clôturé" : `J-${days}`}
            </div>
            <div style={{ fontSize: 10, color: "var(--p-dim)" }}>
              {new Date(opp.closingDate).toLocaleDateString("fr-FR")}
            </div>
            <div style={{ fontSize: 10, color: "var(--p-dim)", marginTop: 2 }}>
              {opp.interestCount} intéressé{opp.interestCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Section({ title, items, color }: { title: string; items: Opp[]; color: string }) {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--p-text)", textTransform: "uppercase", letterSpacing: ".08em" }}>{title}</span>
          <span style={{ fontSize: 11, color: "var(--p-dim)" }}>({items.length})</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((o) => <OppCard key={o.id} opp={o} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title="Tableau de veille"
        subtitle={weekLabel}
        action={
          <button
            onClick={() => window.print()}
            style={{ padding: "7px 14px", fontSize: 12, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer" }}
          >
            ↓ Exporter
          </button>
        }
      />

      {/* Résumé */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Opportunités actives", value: active.length + urgent.length, color: "var(--p-text)" },
          { label: "Clôturent sous 10 jours", value: urgent.length, color: "#f08080" },
          { label: "Intérêts exprimés", value: opps.reduce((s, o) => s + o.interestCount, 0), color: "var(--p-gold)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 8, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".8px", color: "var(--p-muted)", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: "var(--p-font-mono)", fontSize: 30, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : opps.length === 0 ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12, textAlign: "center", padding: 40 }}>Aucune opportunité disponible.</div>
      ) : (
        <>
          <Section title="⚡ Action requise — Clôture imminente" items={urgent} color="#f08080" />
          <Section title="Opportunités en cours" items={active}  color="#6dd49a" />
          <Section title="Clôturées récemment"  items={closed}  color="#7a8590" />
        </>
      )}
    </div>
  );
}
