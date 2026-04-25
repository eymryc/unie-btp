interface Props {
  label: string;
  value: string | number;
  delta?: string;
  deltaUp?: boolean;
  accent?: string;
  icon?: string;
}

export default function KPICard({ label, value, delta, deltaUp, accent, icon }: Props) {
  return (
    <div
      style={{
        background: "var(--p-surface)",
        border: "0.5px solid var(--p-border)",
        borderRadius: 8,
        padding: "16px 18px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color .2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--p-border2)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--p-border)")}
    >
      {/* Accent stripe top */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 2,
        background: accent
          ? `linear-gradient(90deg,${accent},transparent)`
          : "linear-gradient(90deg,var(--p-gold),transparent)",
        opacity: .7,
      }} />

      <div style={{
        fontFamily: "var(--p-font-ui)",
        fontSize: 10,
        color: "var(--p-muted)",
        textTransform: "uppercase",
        letterSpacing: ".9px",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}>
        {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
        {label}
      </div>

      <div style={{
        fontFamily: "var(--p-font-mono)",
        fontSize: 36,
        fontWeight: 400,
        color: accent ?? "var(--p-text)",
        lineHeight: 1,
        letterSpacing: ".03em",
      }}>
        {value}
      </div>

      {delta && (
        <div style={{
          fontFamily: "var(--p-font-ui)",
          fontSize: 11,
          marginTop: 6,
          color: deltaUp ? "var(--p-green)" : "var(--p-red)",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}>
          <span>{deltaUp ? "▲" : "▼"}</span>
          {delta}
        </div>
      )}
    </div>
  );
}
