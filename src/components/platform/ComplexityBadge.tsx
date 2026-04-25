interface Props {
  complexity: string;
  showLabel?: boolean;
}

const MAP: Record<string, { dot: string; label: string; text: string; bg: string; border: string }> = {
  ACCESSIBLE: { dot: "#3da862", label: "Accessible seul",      text: "#6dd49a", bg: "rgba(61,168,98,.12)",  border: "rgba(61,168,98,.28)" },
  GROUPEMENT: { dot: "#d29922", label: "Groupement conseillé", text: "#e8b86d", bg: "rgba(210,153,34,.12)", border: "rgba(210,153,34,.28)" },
  CONSORTIUM: { dot: "#e05050", label: "Consortium requis",    text: "#f08080", bg: "rgba(224,80,80,.12)",  border: "rgba(224,80,80,.28)" },
};

export default function ComplexityBadge({ complexity, showLabel = false }: Props) {
  const cfg = MAP[complexity] ?? MAP.ACCESSIBLE;

  if (!showLabel) {
    return (
      <span
        title={cfg.label}
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
          boxShadow: `0 0 6px ${cfg.dot}66`,
        }}
      />
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 9px",
        borderRadius: 10,
        fontSize: 11,
        fontFamily: "var(--p-font-ui)",
        fontWeight: 500,
        background: cfg.bg,
        color: cfg.text,
        border: `0.5px solid ${cfg.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}
