type Variant = "info" | "warning" | "success" | "error";

const STYLES: Record<Variant, { bg: string; border: string; color: string; icon: string; bar: string }> = {
  info:    { bg: "rgba(42,127,204,.08)",  border: "rgba(42,127,204,.25)",  color: "#6eb3e8", icon: "ℹ", bar: "#2a7fcc" },
  warning: { bg: "rgba(210,153,34,.08)", border: "rgba(210,153,34,.25)", color: "#e8b86d", icon: "⚡", bar: "#d29922" },
  success: { bg: "rgba(61,168,98,.08)",  border: "rgba(61,168,98,.25)",  color: "#6dd49a", icon: "✓", bar: "#3da862" },
  error:   { bg: "rgba(224,80,80,.08)",  border: "rgba(224,80,80,.25)",  color: "#f08080", icon: "✕", bar: "#e05050" },
};

interface Props { variant?: Variant; children: React.ReactNode; }

export default function AlertBanner({ variant = "info", children }: Props) {
  const s = STYLES[variant];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 7,
        marginBottom: 12,
        background: s.bg,
        border: `0.5px solid ${s.border}`,
        color: s.color,
        fontSize: 12,
        fontFamily: "var(--p-font-ui)",
        borderLeft: `2px solid ${s.bar}`,
      }}
    >
      <span style={{ fontSize: 14 }}>{s.icon}</span>
      <span>{children}</span>
    </div>
  );
}
