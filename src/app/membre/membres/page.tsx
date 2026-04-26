"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/platform/TopBar";
import DataTable, { Column } from "@/components/platform/DataTable";

interface CompanyPublic {
  userId: string; name: string; sector: string; city: string;
  specialties: string | null; employees: number | null;
  geographicZone: string | null; availability: string | null;
}

const AVAILABILITY_LABELS: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: "Disponible",    color: "#6dd49a" },
  PARTIAL:   { label: "Partiellement", color: "#e8b86d" },
  BUSY:      { label: "Occupé",        color: "#f08080" },
};

const SECTORS = ["Tous", "BTP – Routes", "Bâtiment", "Hydraulique", "Énergie", "Génie Civil"];

export default function AnnuairePage() {
  const router = useRouter();
  const [members, setMembers] = useState<CompanyPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [sector, setSector]   = useState("Tous");
  const [avail, setAvail]     = useState("Tous");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (sector !== "Tous") params.set("sector", sector);
    if (avail !== "Tous") params.set("availability", avail);
    fetch(`/api/members/directory?${params}`)
      .then((r) => r.json())
      .then((d) => { setMembers(d); setLoading(false); });
  }, [sector, avail]);

  const columns: Column<CompanyPublic>[] = [
    {
      key: "name",
      header: "Entreprise",
      render: (m) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--p-gold-dim)", border: "0.5px solid var(--p-border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--p-gold)", flexShrink: 0 }}>
            {m.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "var(--p-text)" }}>{m.name}</div>
            <div style={{ fontSize: 11, color: "var(--p-muted)" }}>{m.city}</div>
          </div>
        </div>
      ),
    },
    {
      key: "sector",
      header: "Secteur",
      width: 200,
      render: (m) => <span style={{ fontSize: 12, color: "var(--p-muted)" }}>{m.sector}</span>,
    },
    {
      key: "specialties",
      header: "Spécialités",
      render: (m) => (
        <span style={{ fontSize: 11, color: "var(--p-muted)" }}>
          {m.specialties ? m.specialties.split(",").slice(0, 2).join(", ") : "—"}
        </span>
      ),
    },
    {
      key: "employees",
      header: "Effectif",
      width: 80,
      render: (m) => <span style={{ fontSize: 12, color: "var(--p-muted)" }}>{m.employees ?? "—"}</span>,
    },
    {
      key: "availability",
      header: "Disponibilité",
      width: 130,
      render: (m) => {
        const a = m.availability ? AVAILABILITY_LABELS[m.availability] : null;
        return a ? (
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: `${a.color}18`, color: a.color, border: `0.5px solid ${a.color}44` }}>{a.label}</span>
        ) : <span style={{ color: "var(--p-dim)", fontSize: 11 }}>—</span>;
      },
    },
    {
      key: "actions",
      header: "",
      width: 90,
      render: (m) => (
        <button
          onClick={() => router.push(`/membre/membres/${m.userId}`)}
          style={{ padding: "4px 10px", fontSize: 11, background: "rgba(237,97,32,.1)", border: "0.5px solid rgba(237,97,32,.25)", borderRadius: 5, color: "var(--p-gold)", cursor: "pointer" }}
        >
          Voir profil
        </button>
      ),
    },
  ];

  return (
    <div>
      <TopBar title="Annuaire des membres" subtitle={`${members.length} entreprise${members.length !== 1 ? "s" : ""} active${members.length !== 1 ? "s" : ""}`} />

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <select value={sector} onChange={(e) => setSector(e.target.value)} style={{ padding: "6px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 12, color: "var(--p-text)" }}>
          {SECTORS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={avail} onChange={(e) => setAvail(e.target.value)} style={{ padding: "6px 10px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 12, color: "var(--p-text)" }}>
          {["Tous", "AVAILABLE", "PARTIAL", "BUSY"].map((a) => (
            <option key={a} value={a}>{a === "Tous" ? "Disponibilité" : AVAILABILITY_LABELS[a]?.label ?? a}</option>
          ))}
        </select>
      </div>

      <DataTable<CompanyPublic>
        columns={columns}
        data={members}
        loading={loading}
        searchPlaceholder="Rechercher par nom, secteur, spécialités…"
        searchFn={(m, q) => [m.name, m.sector, m.specialties, m.city, m.geographicZone].some((v) => v?.toLowerCase().includes(q))}
        pageSize={10}
        emptyMessage="Aucun membre actif trouvé."
        getRowKey={(m) => m.userId}
      />
    </div>
  );
}
