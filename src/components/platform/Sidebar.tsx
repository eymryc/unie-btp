"use client";

import { usePathname, useRouter } from "next/navigation";

interface NavItem { href: string; label: string; icon: string; }
interface Props {
  role: string;
  companyName?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string | null;
}

const MEMBER_NAV: NavItem[] = [
  { href: "/membre/dashboard",      icon: "⊞", label: "Tableau de bord" },
  { href: "/membre/veille",         icon: "◉", label: "Veille hebdomadaire" },
  { href: "/membre/opportunites",   icon: "◎", label: "Opportunités" },
  { href: "/membre/collaborations", icon: "◈", label: "Collaborations" },
  { href: "/membre/soumissions",    icon: "◷", label: "Mes soumissions" },
  { href: "/membre/membres",        icon: "◑", label: "Annuaire membres" },
  { href: "/membre/outils",         icon: "⊡", label: "Outils & Guides" },
  { href: "/membre/profil",         icon: "◻", label: "Mon profil" },
];
const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard",    icon: "⊞", label: "Tableau de bord" },
  { href: "/admin/membres",      icon: "◻", label: "Membres" },
  { href: "/admin/opportunites", icon: "◎", label: "Opportunités" },
  { href: "/admin/guides",       icon: "⊡", label: "Outils & Guides" },
  { href: "/admin/formations",   icon: "◈", label: "Formations" },
  { href: "/admin/reporting",    icon: "◈", label: "Reporting" },
];

function daysLeft(expiry?: string | null): number | null {
  if (!expiry) return null;
  return Math.ceil((new Date(expiry).getTime() - Date.now()) / 86_400_000);
}

export default function Sidebar({ role, companyName, subscriptionStatus, subscriptionExpiry }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const isAdmin  = role === "ADMIN" || role === "SUPER_ADMIN";
  const nav      = isAdmin ? ADMIN_NAV : MEMBER_NAV;
  const days     = daysLeft(subscriptionExpiry);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="p-dark"
      style={{
        width: 210,
        minWidth: 210,
        background: "var(--p-bg)",
        borderRight: "0.5px solid var(--p-border2)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "var(--p-font-ui)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "18px 16px 16px", borderBottom: "0.5px solid var(--p-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{
            background: "var(--p-gold)",
            color: "#fff",
            fontFamily: "var(--p-font-mono)",
            fontSize: 13,
            letterSpacing: "1px",
            padding: "3px 8px",
            borderRadius: 4,
          }}>
            UNIE
          </span>
          <div>
            <div style={{ fontFamily: "var(--p-font-display)", fontSize: 15, fontWeight: 600, color: "var(--p-text)", lineHeight: 1.1 }}>
              BTP Intelligence
            </div>
            <div style={{ fontFamily: "var(--p-font-ui)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--p-gold)", marginTop: 1 }}>
              {isAdmin ? "Administration" : "Espace membre"}
            </div>
          </div>
        </div>
        {companyName && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "0.5px solid var(--p-border)", fontSize: 11, color: "var(--p-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {companyName}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 9, color: "var(--p-dim)", letterSpacing: "1.2px", textTransform: "uppercase", padding: "0 8px 6px", fontFamily: "var(--p-font-ui)" }}>
          {isAdmin ? "Administration" : "Navigation"}
        </div>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontFamily: "var(--p-font-ui)",
                fontWeight: active ? 600 : 400,
                color: active ? "var(--p-gold)" : "var(--p-muted)",
                background: active
                  ? "linear-gradient(90deg,rgba(237,97,32,.15),rgba(237,97,32,.05))"
                  : "transparent",
                border: active ? "0.5px solid var(--p-border2)" : "0.5px solid transparent",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                transition: "all .15s",
                letterSpacing: active ? ".02em" : 0,
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(237,97,32,.06)"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ width: 16, textAlign: "center", opacity: active ? 1 : .6 }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: "auto", width: 3, height: 14, background: "var(--p-gold)", borderRadius: 2 }} />}
            </button>
          );
        })}
      </div>

      {/* Cotisation */}
      {!isAdmin && subscriptionStatus && (
        <div style={{ padding: "12px 16px", borderTop: "0.5px solid var(--p-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: "var(--p-dim)", textTransform: "uppercase", letterSpacing: "1px" }}>Cotisation</span>
            <span style={{ fontSize: 9, color: days !== null && days < 30 ? "var(--p-red)" : "var(--p-green)", letterSpacing: ".5px" }}>
              {subscriptionStatus === "ACTIVE" ? "ACTIVE" : subscriptionStatus === "PENDING" ? "EN ATTENTE" : "SUSPENDUE"}
            </span>
          </div>
          <div style={{ height: 3, background: "var(--p-border)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              borderRadius: 2,
              background: days !== null && days < 30
                ? "var(--p-red)"
                : "linear-gradient(90deg,var(--p-gold),var(--p-gold-mid))",
              width: days !== null ? `${Math.max(4, Math.min(100, (days / 365) * 100))}%` : "0%",
              transition: "width .6s ease",
            }} />
          </div>
          <div style={{ fontSize: 10, color: "var(--p-muted)", marginTop: 5 }}>
            {subscriptionStatus === "ACTIVE" && days !== null
              ? `Expire dans ${days} j`
              : subscriptionStatus === "PENDING"
              ? "En attente de validation"
              : "Accès suspendu"}
          </div>
        </div>
      )}

      {/* Déconnexion */}
      <div style={{ padding: "10px 12px", borderTop: "0.5px solid var(--p-border)" }}>
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "8px 10px",
            fontSize: 11,
            fontFamily: "var(--p-font-ui)",
            color: "var(--p-muted)",
            background: "transparent",
            border: "0.5px solid var(--p-border)",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--p-border2)";
            (e.currentTarget as HTMLElement).style.color = "var(--p-text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--p-border)";
            (e.currentTarget as HTMLElement).style.color = "var(--p-muted)";
          }}
        >
          <span style={{ fontSize: 13 }}>⎋</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
