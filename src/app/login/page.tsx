"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/membre/dashboard";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? "Identifiants incorrects."); return; }

      const dest = data.role === "ADMIN" || data.role === "SUPER_ADMIN"
        ? "/admin/dashboard"
        : redirect;
      router.push(dest);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 12px",
    background: "rgba(255,255,255,.04)",
    border: "0.5px solid rgba(237,97,32,.2)",
    borderRadius: 7,
    fontSize: 13,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: "#e8e4dc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--night, #070b14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        backgroundImage: "linear-gradient(rgba(237,97,32,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(237,97,32,.03) 1px,transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>

        {/* Card */}
        <div
          style={{
            background: "linear-gradient(135deg,#0c1220 0%,#0b1224 60%,#070b14 100%)",
            border: "0.5px solid rgba(237,97,32,.22)",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,.6), 0 0 0 0.5px rgba(237,97,32,.08) inset",
          }}
        >
          {/* Gold top stripe */}
          <div style={{ height: 3, background: "linear-gradient(90deg,#ed6120,#ff9a5c,transparent)" }} />

          <div style={{ padding: "36px 40px" }}>

            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{
                  background: "#ed6120",
                  color: "#fff",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 15,
                  letterSpacing: "1.5px",
                  padding: "4px 10px",
                  borderRadius: 5,
                }}>
                  UNIE
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: ".12em", color: "#e8e4dc", lineHeight: 1 }}>
                    BTP Intelligence
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "#ed6120", marginTop: 1 }}>
                    Plateforme privée des membres
                  </div>
                </div>
              </div>

              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 26,
                fontWeight: 600,
                color: "#e8e4dc",
                margin: "0 0 6px",
                lineHeight: 1.2,
              }}>
                Connexion membre
              </h1>
              <p style={{ fontSize: 12, color: "#7a8590", margin: 0 }}>
                Accédez à votre espace opportunités
              </p>
            </div>

            {/* Séparateur */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1.5, background: "#ed6120", borderRadius: 1 }} />
              <div style={{ flex: 1, height: "0.5px", background: "rgba(237,97,32,.15)" }} />
            </div>

            {/* Erreur */}
            {error && (
              <div style={{
                background: "rgba(224,80,80,.1)",
                border: "0.5px solid rgba(224,80,80,.3)",
                borderLeft: "2px solid #e05050",
                borderRadius: 7,
                padding: "9px 12px",
                fontSize: 12,
                color: "#f08080",
                marginBottom: 18,
              }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#7a8590", marginBottom: 7 }}>
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#ed6120")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(237,97,32,.2)")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#7a8590", marginBottom: 7 }}>
                  Mot de passe
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ ...inputStyle, paddingRight: 60 }}
                    onFocus={(e) => (e.target.style.borderColor = "#ed6120")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(237,97,32,.2)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#484850", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {showPwd ? "Cacher" : "Voir"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 6,
                  padding: "12px",
                  background: loading ? "rgba(237,97,32,.4)" : "#ed6120",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(237,97,32,.35)",
                  transition: "all .2s",
                }}
              >
                {loading ? "Connexion…" : "Se connecter →"}
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "0.5px solid rgba(237,97,32,.12)", textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "#484850" }}>Pas encore membre ?</span>
              {" "}
              <a href="/" style={{ fontSize: 12, color: "#ed6120", textDecoration: "none", fontWeight: 600 }}>
                Rejoindre l'UNIE BTP →
              </a>
            </div>
          </div>
        </div>

        {/* Démo hint */}
        <div style={{
          marginTop: 16,
          padding: "12px 16px",
          background: "rgba(12,18,32,.8)",
          border: "0.5px solid rgba(237,97,32,.15)",
          borderRadius: 9,
          fontSize: 11,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#e8e4dc", marginBottom: 6, letterSpacing: ".04em" }}>Comptes de démo</div>
          <div style={{ color: "#7a8590", marginBottom: 3 }}>
            Admin → <code style={{ color: "#ed6120", background: "rgba(237,97,32,.1)", padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>admin@unie-btp.com / admin123</code>
          </div>
          <div style={{ color: "#7a8590" }}>
            Membre → <code style={{ color: "#ed6120", background: "rgba(237,97,32,.1)", padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>batikonan@exemple.ci / membre123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
