"use client";

import { useEffect, useState } from "react";
import KPICard from "@/components/platform/KPICard";
import TopBar from "@/components/platform/TopBar";

interface AdminStats {
  totalMembers: number; activeMembers: number; pendingMembers: number; suspendedMembers: number;
  publishedOpportunities: number; totalInterests: number; totalCollaborations: number;
  sectorBreakdown: { sector: string; count: number }[];
}

export default function ReportingPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/admin").then((r) => r.json()).then(setStats);
  }, []);

  const maxCount = Math.max(...(stats?.sectorBreakdown.map((s) => s.count) ?? [1]));
  const activeRate = stats ? Math.round((stats.activeMembers / Math.max(stats.totalMembers, 1)) * 100) : 0;

  return (
    <div>
      <TopBar
        title="Reporting & Statistiques"
        subtitle={`Rapport mensuel — ${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`}
        action={
          <button
            onClick={() => window.print()}
            style={{ padding: "7px 14px", fontSize: 12, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer" }}
          >
            ↓ Exporter PDF
          </button>
        }
      />

      {/* KPIs membres */}
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".8px", color: "var(--p-dim)", marginBottom: 8 }}>Membres & Adhésions</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
        <KPICard label="Membres totaux" value={stats?.totalMembers ?? 0} />
        <KPICard label="Actifs" value={stats?.activeMembers ?? 0} accent="#6dd49a" delta={`${activeRate}% du total`} deltaUp />
        <KPICard label="En attente" value={stats?.pendingMembers ?? 0} accent="#f0c060" />
        <KPICard label="Suspendus" value={stats?.suspendedMembers ?? 0} accent="#f08080" />
      </div>

      {/* KPIs activité */}
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".8px", color: "var(--p-dim)", marginBottom: 8 }}>Activité plateforme</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        <KPICard label="Opportunités publiées" value={stats?.publishedOpportunities ?? 0} />
        <KPICard label="Intérêts exprimés" value={stats?.totalInterests ?? 0} delta={stats ? `Taux ${Math.round((stats.totalInterests / Math.max(stats.publishedOpportunities * Math.max(stats.totalMembers, 1), 1)) * 100)}%` : undefined} deltaUp />
        <KPICard label="Groupements créés" value={stats?.totalCollaborations ?? 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Répartition */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-muted)", marginBottom: 10 }}>Répartition membres par secteur</div>
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16 }}>
            {!stats ? (
              <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
            ) : (
              stats.sectorBreakdown.map((s) => (
                <div key={s.sector} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 11 }}>
                  <div style={{ width: 120, color: "var(--p-muted)", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sector}</div>
                  <div style={{ flex: 1, height: 8, background: "var(--p-border)", borderRadius: 4 }}>
                    <div style={{ height: "100%", borderRadius: 4, background: "var(--p-gold)", width: `${(s.count / maxCount) * 100}%` }} />
                  </div>
                  <div style={{ width: 28, color: "var(--p-text)", fontWeight: 500, fontSize: 12 }}>{s.count}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Résumé taux */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-muted)", marginBottom: 10 }}>Indicateurs de performance</div>
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, overflow: "hidden" }}>
            {[
              { label: "Taux de renouvellement adhésions", value: `${activeRate}%`, up: activeRate >= 80 },
              { label: "Membres actifs / Total", value: `${stats?.activeMembers ?? 0} / ${stats?.totalMembers ?? 0}`, up: true },
              { label: "Opportunités publiées", value: String(stats?.publishedOpportunities ?? 0), up: true },
              { label: "Total intérêts exprimés", value: String(stats?.totalInterests ?? 0), up: true },
              { label: "Groupements créés", value: String(stats?.totalCollaborations ?? 0), up: true },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", borderBottom: i < arr.length - 1 ? "0.5px solid var(--p-border)" : "none", fontSize: 12 }}>
                <span style={{ color: "var(--p-muted)" }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: row.up ? "#6dd49a" : "#f08080" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note rapport */}
      <div style={{ marginTop: 20, padding: 16, background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, fontSize: 12, color: "var(--p-muted)", lineHeight: 1.6 }}>
        <div style={{ fontWeight: 600, color: "var(--p-text)", marginBottom: 6 }}>Note sur le rapport</div>
        Ce rapport présente les statistiques en temps réel de la plateforme UNIE BTP Intelligence.
        Pour la Phase 3, un rapport PDF mensuel automatique sera généré et envoyé à l'administration de l'association,
        incluant les dossiers soumis, les résultats obtenus et les recommandations d'amélioration.
      </div>
    </div>
  );
}
