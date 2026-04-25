"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusPill from "@/components/platform/StatusPill";

interface Message { id: string; userId: string; content: string; createdAt: string; companyName: string; }
interface Member { id: string; userId: string; isLead: boolean; companyName: string; sector: string; }
interface CollabDetail {
  id: string; title: string; status: string; description: string | null;
  opportunity: { id: string; title: string; funder: string; closingDate: string };
  members: Member[]; messages: Message[]; isMember: boolean; isLead: boolean;
}

export default function CollabDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [collab, setCollab] = useState<CollabDetail | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function load() {
    const [collabRes, meRes] = await Promise.all([
      fetch(`/api/collaborations/${id}`),
      fetch("/api/auth/me"),
    ]);
    const [collabData, meData] = await Promise.all([collabRes.json(), meRes.json()]);
    setCollab(collabData);
    setCurrentUserId(meData.id);
  }

  useEffect(() => { load(); }, [id]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [collab?.messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setSending(true);
    await fetch(`/api/collaborations/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: msg }),
    });
    setMsg("");
    setSending(false);
    load();
  }

  if (!collab) return <div style={{ color: "var(--p-dim)", fontSize: 13, padding: 20 }}>Chargement…</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => router.back()} style={{ fontSize: 12, color: "var(--p-muted)", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px" }}>
          ← Retour
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--p-text)" }}>{collab.title}</h1>
              <StatusPill status={collab.status} />
            </div>
            <div style={{ fontSize: 12, color: "var(--p-muted)" }}>
              Opportunité : <span style={{ color: "var(--p-gold)" }}>{collab.opportunity.title}</span> · {collab.opportunity.funder}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14, flex: 1, minHeight: 0 }}>
        {/* Members panel */}
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--p-muted)", marginBottom: 4 }}>
            Membres ({collab.members.length})
          </div>
          {collab.members.map((m) => (
            <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--p-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#0b0e14", flexShrink: 0 }}>
                {m.companyName.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--p-text)" }}>
                  {m.companyName}
                  {m.isLead && <span style={{ marginLeft: 4, fontSize: 9, background: "rgba(237,97,32,.2)", color: "var(--p-gold)", padding: "1px 5px", borderRadius: 3 }}>Chef de file</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--p-muted)" }}>{m.sector}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border)", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {collab.messages.length === 0 ? (
              <div style={{ color: "var(--p-dim)", fontSize: 12, textAlign: "center", margin: "auto" }}>
                Aucun message. Commencez la discussion !
              </div>
            ) : (
              collab.messages.map((m) => {
                const isMe = m.userId === currentUserId;
                return (
                  <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", gap: 2 }}>
                    <div style={{ fontSize: 10, color: "var(--p-dim)" }}>
                      {isMe ? "Vous" : m.companyName} · {new Date(m.createdAt).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                    </div>
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "8px 12px",
                        borderRadius: isMe ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                        background: isMe ? "var(--p-gold)" : "var(--p-surface2)",
                        color: isMe ? "#fff" : "var(--p-text)",
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          {collab.isMember && (
            <form onSubmit={sendMessage} style={{ padding: "12px 16px", borderTop: "0.5px solid var(--p-border)", display: "flex", gap: 8 }}>
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Écrivez votre message…"
                style={{ flex: 1, padding: "9px 12px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 6, fontSize: 13, color: "var(--p-text)", outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--p-gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--p-border)")}
              />
              <button
                type="submit"
                disabled={sending || !msg.trim()}
                style={{ padding: "9px 16px", background: msg.trim() ? "var(--p-gold)" : "rgba(237,97,32,.3)", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, cursor: msg.trim() ? "pointer" : "not-allowed" }}
              >
                {sending ? "…" : "Envoyer"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
