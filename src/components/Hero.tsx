"use client";

import BTPBlueprint3D from "@/components/BTPBlueprint3D";

interface Props { onOpenModal: () => void }

export default function Hero({ onOpenModal }: Props) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="accueil"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,var(--navy) 0%,var(--navy-light) 50%,var(--navy-mid) 100%)" }}
    >
      <BTPBlueprint3D opacity={0.22} intensity={0.7} className="z-[1]" />
      {/* Grid bg (no white/spotlight overlays) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(237,97,32,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(237,97,32,.045) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.85,
        }}
      />

      <div className="max-w-[1280px] mx-auto px-10 pt-[120px] pb-20 w-full relative z-[2] grid grid-cols-2 gap-[80px] items-center hero-grid">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-8" style={{ opacity:0, animation:"fadeUp .8s ease .2s forwards" }}>
            <div className="w-8 h-px bg-[--gold]" />
            <span className="font-['DM_Sans'] text-[11px] font-bold tracking-[.25em] uppercase text-[--gold]">
              Fondée en 2023 · Côte d&apos;Ivoire
            </span>
          </div>

          <h1 className="font-['Cormorant_Garamond'] text-white leading-[1.05] mb-7"
            style={{ fontSize:"clamp(44px,6vw,80px)", fontWeight:600, opacity:0, animation:"fadeUp .8s ease .4s forwards" }}>
            Union Solidaire<br />
            <span className="text-[--gold] italic">des Entrepreneurs</span><br />
            de BTP
          </h1>

          <p className="font-['DM_Sans'] text-white/65 max-w-[480px] mb-12 text-justify"
            style={{ fontSize:17, fontWeight:300, lineHeight:1.75, opacity:0, animation:"fadeUp .8s ease .6s forwards" }}>
            UNIE-BTP est la force collective du secteur de la construction en Côte d&apos;Ivoire.
            Nous protégeons vos intérêts, amplifions votre voix et ouvrons les portes des
            marchés publics pour vos entreprises.
          </p>

          <div className="flex gap-4 flex-wrap" style={{ opacity:0, animation:"fadeUp .8s ease .8s forwards" }}>
            <button onClick={onOpenModal} className="btn-gold">
              <span>Rejoindre l&apos;union</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button onClick={() => scrollTo("about")} className="btn-outline">
              <span>Découvrir notre mission</span>
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-px mt-16 bg-[rgba(237,97,32,.18)] rounded-sm overflow-hidden"
            style={{ opacity:0, animation:"fadeUp .8s ease 1s forwards" }}>
            {[
              { value:"67+", label:"Membres actifs" },
              { value:"2023", label:"Année de création" },
              { value:"3", label:"Axes d'intervention" },
            ].map((s) => (
              <div key={s.label} className="py-5 px-6 bg-[rgba(255,255,255,.03)] border-r border-[rgba(237,97,32,.12)]">
                <div className="font-['Cormorant_Garamond'] text-[32px] font-semibold text-[--gold] leading-none mb-1">{s.value}</div>
                <div className="font-['DM_Sans'] text-[12px] text-white/40 tracking-[.05em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual */}
        <div style={{ opacity:0, animation:"fadeIn 1.2s ease .6s forwards" }}>
          <div className="relative rounded-sm overflow-hidden" style={{ aspectRatio:"4/5", maxHeight:580 }}>
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center"
              style={{ background:"linear-gradient(160deg,var(--navy-mid) 0%,var(--navy) 60%,var(--navy-light) 100%)" }}>
              <svg viewBox="0 0 400 500" width="100%" height="100%" className="absolute inset-0">
                <rect x="60" y="200" width="80" height="250" fill="rgba(237,97,32,.10)"/>
                <rect x="160" y="120" width="100" height="330" fill="rgba(237,97,32,.12)"/>
                <rect x="280" y="160" width="70" height="290" fill="rgba(237,97,32,.09)"/>
                {[220,260,300,340,380].map(y=>[75,100,125].map(x=>(
                  <rect key={`${x}-${y}`} x={x} y={y} width="12" height="18" rx="1" fill="rgba(237,97,32,.28)"/>
                )))}
                {[140,180,220,260,300,340,380].map(y=>[170,200,230].map(x=>(
                  <rect key={`${x}-${y}`} x={x} y={y} width="14" height="20" rx="1" fill="rgba(237,97,32,.22)"/>
                )))}
                <rect x="0" y="450" width="400" height="50" fill="rgba(237,97,32,.06)"/>
                <line x1="320" y1="450" x2="320" y2="80" stroke="rgba(237,97,32,.45)" strokeWidth="3"/>
                <line x1="320" y1="80" x2="180" y2="80" stroke="rgba(237,97,32,.45)" strokeWidth="3"/>
                <line x1="320" y1="80" x2="380" y2="80" stroke="rgba(237,97,32,.34)" strokeWidth="2"/>
                <line x1="260" y1="80" x2="260" y2="140" stroke="rgba(237,97,32,.34)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <polygon points="200,30 220,70 180,70" fill="none" stroke="rgba(237,97,32,.55)" strokeWidth="1.5"/>
              </svg>

              {/* Badge bottom */}
              <div className="absolute bottom-8 left-8 bg-[rgba(15,23,42,.9)] border border-[rgba(237,97,32,.30)] rounded-sm p-4 backdrop-blur-[10px]"
                style={{ animation:"floatY 4s ease-in-out infinite" }}>
                <div className="font-['DM_Sans'] text-[11px] text-[--gold] tracking-[.1em] uppercase mb-1.5">Membres actifs</div>
                <div className="font-['Cormorant_Garamond'] text-[28px] text-white font-semibold leading-none">67 entreprises</div>
              </div>

              {/* Badge top */}
              <div className="absolute top-8 right-8 bg-[--gold] rounded-sm p-3">
                <div className="font-['DM_Sans'] text-[10px] text-white/80 tracking-[.1em] mb-1">FONDÉE EN</div>
                <div className="font-['Bebas_Neue'] text-[24px] text-white tracking-[.05em] leading-none">2023</div>
              </div>
            </div>
          </div>
          <div className="absolute top-[-16px] right-[-16px] w-[120px] h-[120px] border border-[rgba(237,97,32,.25)] rounded-sm pointer-events-none"/>
          <div className="absolute bottom-[-16px] left-[-16px] w-20 h-20 border border-[rgba(237,97,32,.2)] rounded-sm pointer-events-none"/>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity:0, animation:"fadeIn 1s ease 1.5s forwards" }}>
        <span className="font-['DM_Sans'] text-[10px] tracking-[.2em] text-white/30 uppercase">Défiler</span>
        <div className="w-6 h-9 border-[1.5px] border-white/20 rounded-xl flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-[--gold] rounded-sm" style={{ animation:"floatY 1.5s ease-in-out infinite" }}/>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .hero-grid{ grid-template-columns:1fr!important; gap:48px!important; } }
      `}</style>
    </section>
  );
}
