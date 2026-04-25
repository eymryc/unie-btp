"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComplexityBadge from "@/components/platform/ComplexityBadge";
import TopBar from "@/components/platform/TopBar";
import DataTable, { Column } from "@/components/platform/DataTable";

interface Opp {
  id: string;
  title: string;
  funder: string;
  sector: string;
  complexity: string;
  closingDate: string;
  isPublished: boolean;
  interestCount: number;
}

export default function AdminOpportunitesPage() {
  const router = useRouter();
  const [opps, setOpps] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  function load() {
    setLoading(true);
    fetch("/api/opportunities")
      .then((r) => r.json())
      .then((d) => { setOpps(d); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(opp: Opp) {
    await fetch(`/api/opportunities/${opp.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...opp, isPublished: !opp.isPublished }),
    });
    load();
  }

  async function deleteOpp(id: string) {
    if (!confirm("Supprimer cette opportunité ?")) return;
    await fetch(`/api/opportunities/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = filterStatus === "all"
    ? opps
    : filterStatus === "published"
    ? opps.filter((o) => o.isPublished)
    : opps.filter((o) => !o.isPublished);

  const columns: Column<Opp>[] = [
    {
      key: "complexity",
      header: "",
      width: 24,
      render: (o) => <ComplexityBadge complexity={o.complexity} />,
    },
    {
      key: "title",
      header: "Titre du marché",
      render: (o) => (
        <div>
          <div style={{ fontWeight: 500, color: "var(--p-text)" }}>{o.title}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
            <span style={{ fontSize: 10, color: "#79b8ff" }}>{o.funder}</span>
            <span style={{ fontSize: 10, color: "var(--p-dim)" }}>·</span>
            <span style={{ fontSize: 10, color: "#6dd49a" }}>{o.sector}</span>
          </div>
        </div>
      ),
    },
    {
      key: "closingDate",
      header: "Clôture",
      width: 110,
      render: (o) => {
        const days = Math.ceil((new Date(o.closingDate).getTime() - Date.now()) / 86_400_000);
        return (
          <div>
            <div style={{ fontSize: 12, color: "var(--p-text)" }}>
              {new Date(o.closingDate).toLocaleDateString("fr-FR")}
            </div>
            <div style={{ fontSize: 10, color: days <= 0 ? "#f08080" : days <= 10 ? "#f0c060" : "var(--p-dim)" }}>
              {days <= 0 ? "Clôturé" : `J-${days}`}
            </div>
          </div>
        );
      },
    },
    {
      key: "interests",
      header: "Intérêts",
      width: 80,
      render: (o) => (
        <span style={{ fontSize: 12, color: "var(--p-muted)" }}>
          {o.interestCount} <span style={{ fontSize: 10, color: "var(--p-dim)" }}>membre{o.interestCount !== 1 ? "s" : ""}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      width: 100,
      render: (o) => (
        <span style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 10,
          background: o.isPublished ? "rgba(46,160,67,.12)" : "rgba(139,148,158,.1)",
          color: o.isPublished ? "#6dd49a" : "var(--p-dim)",
          border: `0.5px solid ${o.isPublished ? "rgba(46,160,67,.3)" : "rgba(139,148,158,.2)"}`,
        }}>
          {o.isPublished ? "Publié" : "Brouillon"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: 160,
      render: (o) => (
        <div style={{ display: "flex", gap: 5 }}>
          <button
            onClick={() => togglePublish(o)}
            style={{ padding: "4px 8px", fontSize: 10, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 4, color: "var(--p-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {o.isPublished ? "Dépublier" : "Publier"}
          </button>
          <button
            onClick={() => router.push(`/admin/opportunites/${o.id}/modifier`)}
            style={{ padding: "4px 8px", fontSize: 10, background: "rgba(237,97,32,.1)", border: "0.5px solid rgba(237,97,32,.25)", borderRadius: 4, color: "var(--p-gold)", cursor: "pointer" }}
          >
            Modifier
          </button>
          <button
            onClick={() => deleteOpp(o.id)}
            style={{ padding: "4px 8px", fontSize: 10, background: "rgba(248,81,73,.08)", border: "0.5px solid rgba(248,81,73,.2)", borderRadius: 4, color: "#f08080", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TopBar
        title="Gestion des opportunités"
        subtitle={`${opps.length} fiche${opps.length !== 1 ? "s" : ""} au total`}
        action={
          <button
            onClick={() => router.push("/admin/opportunites/nouvelle")}
            style={{ padding: "7px 14px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 600 }}
          >
            + Nouvelle opportunité
          </button>
        }
      />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {([
          ["all", "Toutes", opps.length],
          ["published", "Publiées", opps.filter((o) => o.isPublished).length],
          ["draft", "Brouillons", opps.filter((o) => !o.isPublished).length],
        ] as [string, string, number][]).map(([v, l, count]) => (
          <button
            key={v}
            onClick={() => setFilterStatus(v)}
            style={{
              padding: "5px 12px", fontSize: 12, borderRadius: 6, cursor: "pointer",
              border: "0.5px solid",
              background: filterStatus === v ? "rgba(237,97,32,.12)" : "transparent",
              borderColor: filterStatus === v ? "rgba(237,97,32,.35)" : "var(--p-border)",
              color: filterStatus === v ? "var(--p-gold)" : "var(--p-muted)",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {l}
            <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 8, background: filterStatus === v ? "rgba(237,97,32,.2)" : "var(--p-surface2)", color: filterStatus === v ? "var(--p-gold)" : "var(--p-dim)" }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <DataTable<Opp>
        columns={columns}
        data={filtered}
        loading={loading}
        searchPlaceholder="Rechercher par titre, bailleur, secteur…"
        searchFn={(o, q) =>
          [o.title, o.funder, o.sector].some((v) => v?.toLowerCase().includes(q))
        }
        pageSize={10}
        emptyMessage="Aucune opportunité. Créez la première en cliquant sur « + Nouvelle opportunité »."
        getRowKey={(o) => o.id}
      />
    </div>
  );
}
