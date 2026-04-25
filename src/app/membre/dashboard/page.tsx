"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KPICard from "@/components/platform/KPICard";
import AlertBanner from "@/components/platform/AlertBanner";
import ComplexityBadge from "@/components/platform/ComplexityBadge";
import TopBar from "@/components/platform/TopBar";

interface Stats {
  opportunitiesCount: number;
  savedCount: number;
  interestedCount: number;
  collaborationsCount: number;
  submissionsCount: number;
  recentOpportunities: { id: string; title: string; funder: string; sector: string; complexity: string; closingDate: string; interestCount: number; isSaved: boolean; isInterested: boolean }[];
  myCollaborations: { id: string; title: string; status: string; memberCount: number }[];
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function MemberDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/member")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const urgent = stats?.recentOpportunities.filter((o) => daysUntil(o.closingDate) <= 10) ?? [];

  return (
    <div>
      <TopBar
        title="Tableau de bord"
        subtitle={`Bonjour — ${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />

      {urgent.length > 0 && (
        <AlertBanner variant="warning">
          {urgent.length} appel{urgent.length > 1 ? "s" : ""} d&apos;offres se clôture{urgent.length > 1 ? "nt" : ""} dans les 10 prochains jours — action requise
        </AlertBanner>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        <KPICard label="Opportunités actives" value={stats?.opportunitiesCount ?? 0} delta={stats ? "+disponibles" : undefined} deltaUp />
        <KPICard label="Sauvegardées" value={stats?.savedCount ?? 0} />
        <KPICard label="Intérêts exprimés" value={stats?.interestedCount ?? 0} />
        <KPICard label="Collaborations" value={stats?.collaborationsCount ?? 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Opportunités récentes */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-muted)", marginBottom: 10, letterSpacing: ".3px" }}>Opportunités récentes</div>
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, overflow: "hidden" }}>
            {!stats ? (
              <div style={{ padding: 20, color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
            ) : stats.recentOpportunities.length === 0 ? (
              <div style={{ padding: 20, color: "var(--p-dim)", fontSize: 12 }}>Aucune opportunité disponible.</div>
            ) : (
              stats.recentOpportunities.map((opp, i) => {
                const days = daysUntil(opp.closingDate);
                return (
                  <div
                    key={opp.id}
                    onClick={() => router.push(`/membre/opportunites/${opp.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "11px 16px",
                      borderBottom: i < stats.recentOpportunities.length - 1 ? "0.5px solid var(--p-border)" : "none",
                      cursor: "pointer",
                      transition: "background .1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <ComplexityBadge complexity={opp.complexity} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opp.title}</div>
                      <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(56,139,253,.1)", color: "#79b8ff", border: "0.5px solid rgba(56,139,253,.3)" }}>{opp.funder}</span>
                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(46,160,67,.08)", color: "#6dd49a", border: "0.5px solid rgba(46,160,67,.25)" }}>{opp.sector}</span>
                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: days <= 10 ? "rgba(248,81,73,.1)" : "rgba(210,153,34,.08)", color: days <= 10 ? "#f08080" : "#f0c060", border: `0.5px solid ${days <= 10 ? "rgba(248,81,73,.3)" : "rgba(210,153,34,.25)"}` }}>
                          Clôture {new Date(opp.closingDate).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/membre/opportunites/${opp.id}`); }}
                      style={{ padding: "4px 9px", fontSize: 10, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 4, color: "var(--p-gold)", cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Voir →
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Collaborations */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-muted)", marginBottom: 10, letterSpacing: ".3px" }}>Mes collaborations actives</div>
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 14 }}>
            {!stats ? (
              <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
            ) : stats.myCollaborations.length === 0 ? (
              <div style={{ color: "var(--p-dim)", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>◈</div>
                Aucune collaboration en cours.
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => router.push("/membre/opportunites")}
                    style={{ padding: "6px 12px", fontSize: 11, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 5, color: "var(--p-gold)", cursor: "pointer" }}
                  >
                    Parcourir les opportunités
                  </button>
                </div>
              </div>
            ) : (
              stats.myCollaborations.map((c) => (
                <div key={c.id} style={{ background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)", marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "var(--p-muted)", marginBottom: 8 }}>{c.memberCount} membre{c.memberCount > 1 ? "s" : ""}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => router.push(`/membre/collaborations/${c.id}`)}
                      style={{ padding: "4px 8px", fontSize: 10, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 4, color: "var(--p-gold)", cursor: "pointer" }}
                    >
                      Messagerie
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
