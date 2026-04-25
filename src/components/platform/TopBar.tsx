interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function TopBar({ title, subtitle, action }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{
            fontFamily: "var(--p-font-display)",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--p-text)",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-.01em",
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontFamily: "var(--p-font-ui)",
              fontSize: 12,
              color: "var(--p-muted)",
              margin: "4px 0 0",
              letterSpacing: ".02em",
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0, paddingTop: 4 }}>{action}</div>}
      </div>

      {/* Séparateur avec accent gold */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
        <div style={{ width: 28, height: 2, background: "var(--p-gold)", borderRadius: 1 }} />
        <div style={{ flex: 1, height: "0.5px", background: "var(--p-border)" }} />
      </div>
    </div>
  );
}
