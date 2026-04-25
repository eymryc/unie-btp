"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KPICard from "@/components/platform/KPICard";
import TopBar from "@/components/platform/TopBar";

interface AdminStats {
  totalMembers: number; activeMembers: number; pendingMembers: number; suspendedMembers: number;
  publishedOpportunities: number; totalInterests: number; totalCollaborations: number;
  sectorBreakdown: { sector: string; count: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/admin").then((r) => r.json()).then(setStats);
  }, []);

  const maxCount = Math.max(...(stats?.sectorBreakdown.map((s) => s.count) ?? [1]));

  return (
    <div>
      <TopBar
        title="Administration UNIE BTP"
        subtitle="Vue d'ensemble de la plateforme"
        action={
          <button
            onClick={() => router.push("/admin/opportunites/nouvelle")}
            style={{ padding: "7px 14px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 600 }}
          >
            + Nouvelle opportunité
          </button>
        }
      />

      {/* KPIs membres */}
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".8px", color: "var(--p-dim)", marginBottom: 8 }}>Membres</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        <KPICard label="Membres totaux" value={stats?.totalMembers ?? 0} delta={`${stats?.activeMembers ?? 0} actifs`} deltaUp />
        <KPICard label="Cotisations actives" value={stats?.activeMembers ?? 0} accent="#6dd49a" />
        <KPICard label="En attente" value={stats?.pendingMembers ?? 0} accent="#f0c060" />
        <KPICard label="Suspendus" value={stats?.suspendedMembers ?? 0} accent="#f08080" />
      </div>

      {/* KPIs opportunités */}
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".8px", color: "var(--p-dim)", marginBottom: 8 }}>Activité plateforme</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        <KPICard label="Opportunités publiées" value={stats?.publishedOpportunities ?? 0} />
        <KPICard label="Intérêts exprimés" value={stats?.totalInterests ?? 0} />
        <KPICard label="Groupements créés" value={stats?.totalCollaborations ?? 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Répartition secteurs */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-muted)", marginBottom: 10 }}>Répartition membres par secteur</div>
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16 }}>
            {!stats ? (
              <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
            ) : (
              stats.sectorBreakdown.map((s) => (
                <div key={s.sector} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 11 }}>
                  <div style={{ width: 90, color: "var(--p-muted)", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.sector}</div>
                  <div style={{ flex: 1, height: 6, background: "var(--p-border)", borderRadius: 3 }}>
                    <div style={{ height: "100%", borderRadius: 3, background: "var(--p-gold)", width: `${(s.count / maxCount) * 100}%`, transition: "width .4s" }} />
                  </div>
                  <div style={{ width: 20, color: "var(--p-muted)", fontSize: 10 }}>{s.count}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-muted)", marginBottom: 10 }}>Actions rapides</div>
          <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Gérer les membres", sub: "Valider et activer les abonnements", href: "/admin/membres", color: "var(--p-gold)" },
              { label: "Publier une opportunité", sub: "Ajouter un nouvel appel d'offres", href: "/admin/opportunites/nouvelle", color: "#6dd49a" },
              { label: "Consulter les opportunités", sub: "Gérer les fiches publiées", href: "/admin/opportunites", color: "#79b8ff" },
              { label: "Rapports & statistiques", sub: "Rapport mensuel de performance", href: "/admin/reporting", color: "#f0c060" },
            ].map((a) => (
              <button
                key={a.href}
                onClick={() => router.push(a.href)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 7, cursor: "pointer", textAlign: "left", transition: "border-color .15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = a.color + "55")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--p-border)")}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: a.color }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "var(--p-dim)", marginTop: 1 }}>{a.sub}</div>
                </div>
                <span style={{ color: "var(--p-dim)", fontSize: 14 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
