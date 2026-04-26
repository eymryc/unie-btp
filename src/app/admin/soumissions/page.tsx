"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TopBar from "@/components/platform/TopBar";
import DataTable, { Column } from "@/components/platform/DataTable";
import StatusPill from "@/components/platform/StatusPill";

interface AdminSub {
  id: string;
  companyName: string | null;
  opportunityTitle: string;
  funder: string;
  status: string;
  result: string | null;
  createdAt: string;
  notes?: string | null;
}

const STATUS_OPTIONS = [
  { value: "PREPARING", label: "En préparation", icon: "📝" },
  { value: "SUBMITTED", label: "Dossier soumis", icon: "📤" },
  { value: "CLOSED", label: "Clôturé", icon: "✅" },
] as const;

const RESULT_OPTIONS = [
  { value: "PENDING", label: "En attente", icon: "⏳" },
  { value: "WON", label: "Remporté", icon: "🏆" },
  { value: "LOST", label: "Perdu", icon: "✕" },
] as const;

function KebabMenu({
  open,
  onToggle,
  onClose,
  children,
  disabled,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = 240;
    const gap = 6;
    const left = Math.min(window.innerWidth - width - 8, Math.max(8, r.right - width));
    const top = Math.min(window.innerHeight - 20, r.bottom + gap);
    setPos({ top, left });
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        ref={btnRef}
        disabled={disabled}
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          width: 34,
          height: 30,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "0.5px solid var(--p-border)",
          borderRadius: 8,
          color: "var(--p-muted)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
        title="Actions"
      >
        ⋯
      </button>

      {open && !disabled && pos && (
        <div
          role="menu"
          style={{
            position: "fixed",
            left: pos.left,
            top: pos.top,
            zIndex: 40,
            width: 240,
            background: "var(--p-surface)",
            border: "0.5px solid var(--p-border2)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 14px 34px rgba(0,0,0,.45)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MenuSection({ title }: { title: string }) {
  return (
    <div style={{ padding: "10px 12px 6px", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--p-dim)" }}>
      {title}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      style={{
        width: "100%",
        padding: "9px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: active ? "rgba(237,97,32,.10)" : "transparent",
        border: "none",
        borderTop: "0.5px solid var(--p-border)",
        cursor: active ? "default" : "pointer",
        color: active ? "var(--p-gold)" : "var(--p-text)",
        textAlign: "left",
      }}
      disabled={active}
    >
      <span style={{ width: 16, textAlign: "center", opacity: active ? 1 : 0.8 }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{label}</span>
      {active && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--p-gold)" }}>✓</span>}
    </button>
  );
}

export default function AdminSoumissionsPage() {
  const [subs, setSubs] = useState<AdminSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((d) => {
        setSubs(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => {
        setSubs([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function patchSub(id: string, patch: Partial<Pick<AdminSub, "status" | "result" | "notes">>) {
    setUpdatingId(id);
    await fetch(`/api/submissions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setUpdatingId(null);
    load();
  }

  const columns: Column<AdminSub>[] = [
    {
      key: "company",
      header: "Entreprise",
      width: 190,
      render: (s) => (
        <span style={{ fontSize: 12, color: "var(--p-text)" }}>
          {s.companyName ?? "—"}
        </span>
      ),
    },
    {
      key: "opp",
      header: "Opportunité",
      render: (s) => (
        <div>
          <div style={{ fontWeight: 500, color: "var(--p-text)" }}>{s.opportunityTitle}</div>
          <div style={{ fontSize: 10, color: "#79b8ff", marginTop: 2 }}>{s.funder}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      width: 130,
      render: (s) => <StatusPill status={s.status} />,
    },
    {
      key: "result",
      header: "Résultat",
      width: 120,
      render: (s) => (
        <span style={{ fontSize: 11, color: s.result === "WON" ? "#6dd49a" : s.result === "LOST" ? "#f08080" : "var(--p-dim)" }}>
          {s.result ?? "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Déclarée",
      width: 120,
      render: (s) => (
        <span style={{ fontSize: 11, color: "var(--p-dim)" }}>
          {new Date(s.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: 90,
      render: (s) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <KebabMenu
            disabled={updatingId === s.id}
            open={openMenuId === s.id}
            onToggle={() => setOpenMenuId((curr) => (curr === s.id ? null : s.id))}
            onClose={() => setOpenMenuId(null)}
          >
            <MenuSection title="Statut" />
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                icon={opt.icon}
                label={opt.label}
                active={s.status === opt.value}
                onClick={async () => {
                  setOpenMenuId(null);
                  await patchSub(s.id, { status: opt.value });
                }}
              />
            ))}

            <MenuSection title="Résultat" />
            {RESULT_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                icon={opt.icon}
                label={opt.label}
                active={(s.result ?? "PENDING") === opt.value}
                onClick={async () => {
                  setOpenMenuId(null);
                  await patchSub(s.id, { result: opt.value });
                }}
              />
            ))}
          </KebabMenu>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TopBar
        title="Soumissions membres"
        subtitle="Suivi des dossiers déclarés par les membres"
      />

      <DataTable<AdminSub>
        columns={columns}
        data={subs}
        loading={loading}
        searchPlaceholder="Rechercher entreprise, opportunité, bailleur…"
        searchFn={(s, q) => [s.companyName ?? "", s.opportunityTitle, s.funder].some((v) => v?.toLowerCase().includes(q))}
        pageSize={10}
        emptyMessage="Aucune soumission déclarée pour le moment."
        getRowKey={(s) => s.id}
      />
    </div>
  );
}

