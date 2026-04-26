"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/platform/TopBar";
import DataTable, { Column } from "@/components/platform/DataTable";

interface TrainingSession {
  id: string;
  title: string;
  details: string;
  accentColor: string | null;
  signupUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

interface FormationRequestAdmin {
  id: string;
  companyName: string;
  sector: string;
  status: string;
  createdAt: string;
  trainingSessionId: string | null;
  trainingSessionTitle: string | null;
  message: string;
}

export default function AdminFormationsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<FormationRequestAdmin[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/training-sessions")
      .then((r) => r.json())
      .then((d) => {
        setSessions(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => {
        setSessions([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  function loadRequests() {
    setRequestsLoading(true);
    fetch("/api/accompagnement?type=formation")
      .then((r) => r.json())
      .then((d) => {
        setRequests(Array.isArray(d) ? d : []);
        setRequestsLoading(false);
      })
      .catch(() => {
        setRequests([]);
        setRequestsLoading(false);
      });
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function createSession() {
    const title = prompt("Titre de la session ?");
    if (!title?.trim()) return;
    const details = prompt("Détails (date/heure/lieu) ?");
    if (!details?.trim()) return;

    await fetch("/api/training-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        details: details.trim(),
        accentColor: null,
        signupUrl: null,
        isPublished: true,
      }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette session ?")) return;
    await fetch(`/api/training-sessions/${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(s: TrainingSession) {
    await fetch(`/api/training-sessions/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...s, isPublished: !s.isPublished }),
    });
    load();
  }

  async function openEdit(s: TrainingSession) {
    const title = prompt("Titre", s.title);
    if (title === null) return;
    const details = prompt("Détails", s.details);
    if (details === null) return;
    const accentColor = prompt("Couleur (optionnel)", s.accentColor ?? "") ?? "";
    const signupUrl = prompt("Lien d'inscription (optionnel)", s.signupUrl ?? "") ?? "";

    await fetch(`/api/training-sessions/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...s,
        title: title.trim(),
        details: details.trim(),
        accentColor: accentColor.trim() || null,
        signupUrl: signupUrl.trim() || null,
      }),
    });
    load();
  }

  const columns: Column<TrainingSession>[] = [
    {
      key: "title",
      header: "Session",
      render: (s) => (
        <div>
          <div style={{ fontWeight: 500, color: "var(--p-text)" }}>{s.title}</div>
          <div style={{ fontSize: 11, color: s.accentColor ?? "var(--p-muted)", marginTop: 2 }}>{s.details}</div>
          {s.signupUrl && <div style={{ fontSize: 10, color: "var(--p-gold)", marginTop: 2 }}>↗ Lien d'inscription défini</div>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      width: 100,
      render: (s) => (
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 10,
            background: s.isPublished ? "rgba(46,160,67,.12)" : "rgba(139,148,158,.1)",
            color: s.isPublished ? "#6dd49a" : "var(--p-dim)",
            border: `0.5px solid ${s.isPublished ? "rgba(46,160,67,.3)" : "rgba(139,148,158,.2)"}`,
          }}
        >
          {s.isPublished ? "Publié" : "Masqué"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: 210,
      render: (s) => (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => togglePublish(s)}
            style={{ padding: "4px 8px", fontSize: 10, background: "transparent", border: "0.5px solid var(--p-border)", borderRadius: 4, color: "var(--p-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {s.isPublished ? "Masquer" : "Publier"}
          </button>
          <button
            onClick={() => openEdit(s)}
            style={{ padding: "4px 8px", fontSize: 10, background: "rgba(237,97,32,.1)", border: "0.5px solid rgba(237,97,32,.25)", borderRadius: 4, color: "var(--p-gold)", cursor: "pointer" }}
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(s.id)}
            style={{ padding: "4px 8px", fontSize: 10, background: "rgba(248,81,73,.08)", border: "0.5px solid rgba(248,81,73,.2)", borderRadius: 4, color: "#f08080", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      ),
    },
  ];

  const requestColumns: Column<FormationRequestAdmin>[] = [
    {
      key: "session",
      header: "Formation",
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--p-text)" }}>{r.trainingSessionTitle ?? "—"}</div>
          <div style={{ fontSize: 10, color: "var(--p-dim)", marginTop: 2 }}>{r.message}</div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Entreprise",
      width: 200,
      render: (r) => (
        <div>
          <div style={{ fontSize: 12, color: "var(--p-text)" }}>{r.companyName}</div>
          <div style={{ fontSize: 10, color: "var(--p-dim)" }}>{r.sector}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      width: 110,
      render: (r) => (
        <span style={{ fontSize: 11, color: r.status === "DONE" ? "#6dd49a" : r.status === "PROCESSING" ? "#e8b86d" : "var(--p-dim)" }}>
          {r.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Demande",
      width: 120,
      render: (r) => (
        <span style={{ fontSize: 11, color: "var(--p-dim)" }}>
          {new Date(r.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <TopBar
        title="Formations & Sessions"
        subtitle={`${sessions.length} session${sessions.length !== 1 ? "s" : ""} au total`}
        action={
          <button
            onClick={createSession}
            style={{
              padding: "7px 14px",
              fontSize: 12,
              background: "var(--p-gold)",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            + Nouvelle session
          </button>
        }
      />

      <DataTable<TrainingSession>
        columns={columns}
        data={sessions}
        loading={loading}
        searchPlaceholder="Rechercher par titre, détails…"
        searchFn={(s, q) => [s.title, s.details].some((v) => v?.toLowerCase().includes(q))}
        pageSize={10}
        emptyMessage="Aucune session. Cliquez sur « + Nouvelle session » pour en créer une."
        getRowKey={(s) => s.id}
      />

      <div style={{ marginTop: 18 }}>
        <TopBar
          title="Demandes d'inscription"
          subtitle={`${requests.length} demande${requests.length !== 1 ? "s" : ""}`}
        />
        <DataTable<FormationRequestAdmin>
          columns={requestColumns}
          data={requests}
          loading={requestsLoading}
          searchPlaceholder="Rechercher formation, entreprise…"
          searchFn={(r, q) => [r.trainingSessionTitle ?? "", r.companyName, r.sector, r.message].some((v) => v?.toLowerCase().includes(q))}
          pageSize={10}
          emptyMessage="Aucune demande de formation."
          getRowKey={(r) => r.id}
        />
      </div>
    </div>
  );
}

