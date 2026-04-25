"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";
import StatusPill from "@/components/platform/StatusPill";
import DataTable, { Column } from "@/components/platform/DataTable";

interface Member {
  id: string;
  email: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    sector: string;
    city: string;
    subscriptionStatus: string;
    subscriptionExpiry: string | null;
  } | null;
}

export default function AdminMembresPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => { setMembers(d); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(userId: string, status: string) {
    setUpdating(userId);
    await fetch(`/api/members/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionStatus: status }),
    });
    setUpdating(null);
    load();
  }

  const filtered = filter === "all"
    ? members
    : members.filter((m) => m.company?.subscriptionStatus === filter);

  const columns: Column<Member>[] = [
    {
      key: "company",
      header: "Entreprise",
      render: (m) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "var(--p-muted)", flexShrink: 0 }}>
            {m.company?.name.charAt(0) ?? "?"}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "var(--p-text)" }}>{m.company?.name ?? "—"}</div>
            <div style={{ fontSize: 11, color: "var(--p-muted)" }}>{m.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "sector",
      header: "Secteur",
      width: 180,
      render: (m) => <span style={{ color: "var(--p-muted)" }}>{m.company?.sector ?? "—"}</span>,
    },
    {
      key: "city",
      header: "Ville",
      width: 120,
      render: (m) => <span style={{ color: "var(--p-muted)" }}>{m.company?.city ?? "—"}</span>,
    },
    {
      key: "status",
      header: "Statut",
      width: 120,
      render: (m) => <StatusPill status={m.company?.subscriptionStatus ?? "PENDING"} />,
    },
    {
      key: "expiry",
      header: "Expiration",
      width: 110,
      render: (m) => (
        <span style={{ fontSize: 11, color: "var(--p-dim)" }}>
          {m.company?.subscriptionExpiry
            ? new Date(m.company.subscriptionExpiry).toLocaleDateString("fr-FR")
            : "—"}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Inscription",
      width: 110,
      render: (m) => (
        <span style={{ fontSize: 11, color: "var(--p-dim)" }}>
          {new Date(m.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: 130,
      render: (m) => (
        <div style={{ display: "flex", gap: 5 }}>
          {m.company?.subscriptionStatus !== "ACTIVE" ? (
            <button
              onClick={() => changeStatus(m.id, "ACTIVE")}
              disabled={updating === m.id}
              style={{ padding: "4px 10px", fontSize: 11, background: "rgba(46,160,67,.12)", border: "0.5px solid rgba(46,160,67,.3)", borderRadius: 5, color: "#6dd49a", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {updating === m.id ? "…" : "Activer"}
            </button>
          ) : (
            <button
              onClick={() => changeStatus(m.id, "SUSPENDED")}
              disabled={updating === m.id}
              style={{ padding: "4px 10px", fontSize: 11, background: "rgba(248,81,73,.08)", border: "0.5px solid rgba(248,81,73,.25)", borderRadius: 5, color: "#f08080", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {updating === m.id ? "…" : "Suspendre"}
            </button>
          )}
        </div>
      ),
    },
  ];

  const counts = {
    ACTIVE:    members.filter((m) => m.company?.subscriptionStatus === "ACTIVE").length,
    PENDING:   members.filter((m) => m.company?.subscriptionStatus === "PENDING").length,
    SUSPENDED: members.filter((m) => m.company?.subscriptionStatus === "SUSPENDED").length,
  };

  return (
    <div>
      <TopBar
        title="Gestion des membres"
        subtitle={`${members.length} entreprise${members.length !== 1 ? "s" : ""} inscrite${members.length !== 1 ? "s" : ""}`}
      />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {([
          ["all", "Tous", members.length],
          ["ACTIVE", "Actifs", counts.ACTIVE],
          ["PENDING", "En attente", counts.PENDING],
          ["SUSPENDED", "Suspendus", counts.SUSPENDED],
        ] as [string, string, number][]).map(([v, l, count]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            style={{
              padding: "5px 12px", fontSize: 12, borderRadius: 6, cursor: "pointer",
              border: "0.5px solid",
              background: filter === v ? "rgba(237,97,32,.12)" : "transparent",
              borderColor: filter === v ? "rgba(237,97,32,.35)" : "var(--p-border)",
              color: filter === v ? "var(--p-gold)" : "var(--p-muted)",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {l}
            <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 8, background: filter === v ? "rgba(237,97,32,.2)" : "var(--p-surface2)", color: filter === v ? "var(--p-gold)" : "var(--p-dim)" }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <DataTable<Member>
        columns={columns}
        data={filtered}
        loading={loading}
        searchPlaceholder="Rechercher par nom, email, secteur, ville…"
        searchFn={(m, q) =>
          [m.email, m.company?.name, m.company?.sector, m.company?.city]
            .some((v) => v?.toLowerCase().includes(q))
        }
        pageSize={10}
        emptyMessage="Aucun membre dans cette catégorie"
        getRowKey={(m) => m.id}
      />
    </div>
  );
}
