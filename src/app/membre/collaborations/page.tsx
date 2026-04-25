"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/platform/TopBar";
import StatusPill from "@/components/platform/StatusPill";

interface Collab {
  id: string; title: string; status: string; description: string | null;
  memberCount: number; opportunityTitle: string; createdAt: string;
}

export default function CollaborationsPage() {
  const router = useRouter();
  const [collabs, setCollabs] = useState<Collab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collaborations")
      .then((r) => r.json())
      .then((d) => { setCollabs(d); setLoading(false); });
  }, []);

  return (
    <div>
      <TopBar
        title="Collaborations & Groupements"
        subtitle="Vos groupements en cours sur les appels d'offres"
        action={
          <button
            onClick={() => router.push("/membre/opportunites")}
            style={{ padding: "7px 14px", fontSize: 12, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 6, color: "var(--p-gold)", cursor: "pointer" }}
          >
            + Créer depuis une opportunité
          </button>
        }
      />

      {loading ? (
        <div style={{ color: "var(--p-dim)", fontSize: 12 }}>Chargement…</div>
      ) : collabs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--p-dim)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>◈</div>
          <div style={{ fontSize: 14, marginBottom: 6, color: "var(--p-muted)" }}>Aucun groupement actif</div>
          <p style={{ fontSize: 12, maxWidth: 360, margin: "0 auto 16px" }}>
            Consultez les opportunités et proposez un groupement sur celles nécessitant un consortium.
          </p>
          <button
            onClick={() => router.push("/membre/opportunites")}
            style={{ padding: "8px 16px", fontSize: 12, background: "var(--p-gold)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer" }}
          >
            Parcourir les opportunités
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
          {collabs.map((c) => (
            <div
              key={c.id}
              style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 16, cursor: "pointer", transition: "border-color .15s" }}
              onClick={() => router.push(`/membre/collaborations/${c.id}`)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(237,97,32,.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--p-border)")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <StatusPill status={c.status} />
                <span style={{ fontSize: 11, color: "var(--p-dim)" }}>{c.memberCount} membre{c.memberCount > 1 ? "s" : ""}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--p-text)", marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: "var(--p-muted)", marginBottom: 10 }}>
                Opp. : {c.opportunityTitle}
              </div>
              {c.description && (
                <div style={{ fontSize: 11, color: "var(--p-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.description}
                </div>
              )}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "0.5px solid var(--p-border)", display: "flex", gap: 6 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/membre/collaborations/${c.id}`); }}
                  style={{ flex: 1, padding: "6px", fontSize: 11, background: "rgba(237,97,32,.12)", border: "0.5px solid rgba(237,97,32,.3)", borderRadius: 5, color: "var(--p-gold)", cursor: "pointer" }}
                >
                  Messagerie →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
