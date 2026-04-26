"use client";

export default function NotFound() {
  return (
    <main
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <p className="text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-3">
        404
      </p>
      <h1 className="font-['Rajdhani'] text-[44px] leading-[1.1] font-semibold mb-4">
        Page introuvable
      </h1>
      <p className="text-[15px] max-w-[520px]" style={{ color: "var(--text-muted)" }}>
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <div className="mt-8">
        <a href="/" className="btn-gold">
          <span>Retour à l’accueil</span>
        </a>
      </div>
    </main>
  );
}

