const MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ACTIVE:    { label: "Actif",      color: "#6dd49a", bg: "rgba(61,168,98,.14)",   border: "rgba(61,168,98,.3)" },
  PENDING:   { label: "En attente", color: "#e8b86d", bg: "rgba(210,153,34,.14)",  border: "rgba(210,153,34,.3)" },
  EXPIRED:   { label: "Expiré",     color: "#f08080", bg: "rgba(224,80,80,.12)",   border: "rgba(224,80,80,.28)" },
  SUSPENDED: { label: "Suspendu",   color: "#f08080", bg: "rgba(224,80,80,.12)",   border: "rgba(224,80,80,.28)" },
  FORMING:   { label: "Formation",  color: "#6eb3e8", bg: "rgba(42,127,204,.12)",  border: "rgba(42,127,204,.28)" },
  ACTIVE_C:  { label: "Actif",      color: "#6dd49a", bg: "rgba(61,168,98,.14)",   border: "rgba(61,168,98,.3)" },
  SUBMITTED: { label: "Soumis",     color: "#e8b86d", bg: "rgba(210,153,34,.12)",  border: "rgba(210,153,34,.28)" },
  CLOSED:    { label: "Clôturé",    color: "#7a8590", bg: "rgba(122,133,144,.1)",  border: "rgba(122,133,144,.22)" },
  WON:       { label: "Remporté",   color: "#6dd49a", bg: "rgba(61,168,98,.14)",   border: "rgba(61,168,98,.3)" },
  LOST:      { label: "Perdu",      color: "#f08080", bg: "rgba(224,80,80,.12)",   border: "rgba(224,80,80,.28)" },
};

export default function StatusPill({ status }: { status: string }) {
  const s = MAP[status] ?? MAP.PENDING;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "var(--p-font-ui)",
        letterSpacing: ".04em",
        background: s.bg,
        color: s.color,
        border: `0.5px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}
