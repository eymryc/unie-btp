"use client";

interface Props { onOpenModal: () => void }

export default function Hero({ onOpenModal }: Props) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="accueil"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,var(--night) 0%,var(--night-2) 55%,var(--night-3) 100%)" }}
    >
      {/* Grille CSS — charte */}
      <div className="grid-texture" style={{ opacity:.9 }} />
      {/* Halo orange */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background:"radial-gradient(ellipse 60% 50% at 70% 50%,rgba(237,97,32,.07) 0%,transparent 70%)" }} />

      <div className="max-w-[1280px] mx-auto px-10 pt-[120px] pb-20 w-full relative z-[2] grid grid-cols-2 gap-[80px] items-center hero-grid">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-8" style={{ opacity:0, animation:"fadeUp .8s ease .2s forwards" }}>
            <div className="w-8 h-px bg-[--gold]" />
            <span className="font-['Rajdhani'] text-[11px] font-bold tracking-[.25em] uppercase text-[--gold]">
              Fondée en 2023 · Côte d&apos;Ivoire
            </span>
          </div>

          <h1 className="font-['Rajdhani'] text-white leading-[1.05] mb-7"
            style={{ fontSize:"clamp(44px,6vw,80px)", fontWeight:600, opacity:0, animation:"fadeUp .8s ease .4s forwards" }}>
            Union Solidaire<br />
            <span className="text-[--gold] italic">des Entrepreneurs</span><br />
            de BTP
          </h1>

          <p className="font-['Rajdhani'] text-white/65 max-w-[480px] mb-12 text-justify"
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
          <div className="grid grid-cols-3 gap-px mt-16 overflow-hidden"
            style={{ opacity:0, animation:"fadeUp .8s ease 1s forwards", background:"rgba(237,97,32,.2)", borderRadius:4 }}>
            {[
              { value:"67+",  label:"Membres actifs" },
              { value:"2023", label:"Année de création" },
              { value:"3",    label:"Axes d'intervention" },
            ].map((s) => (
              <div key={s.label} className="py-5 px-6" style={{ background:"rgba(255,255,255,.03)", borderRight:"1px solid rgba(237,97,32,.12)" }}>
                <div className="font-['Rajdhani'] text-[32px] font-semibold leading-none mb-1" style={{ color:"var(--primary)" }}>{s.value}</div>
                <div className="font-['Rajdhani'] text-[12px] tracking-[.05em]" style={{ color:"rgba(255,255,255,.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual — blueprint SVG */}
        <div style={{ opacity:0, animation:"fadeIn 1.2s ease .6s forwards" }}>
          <div className="relative rounded-sm overflow-hidden" style={{ aspectRatio:"4/5", maxHeight:580 }}>
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center"
              style={{ background:"linear-gradient(160deg,var(--night-3) 0%,var(--night-2) 60%,var(--night) 100%)" }}>
              {/* Grid interne */}
              <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(237,97,32,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(237,97,32,.06) 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
              <svg viewBox="0 0 400 500" width="100%" height="100%" className="absolute inset-0">
                <rect x="60"  y="200" width="80"  height="250" fill="rgba(237,97,32,.10)"/>
                <rect x="160" y="120" width="100" height="330" fill="rgba(237,97,32,.12)"/>
                <rect x="280" y="160" width="70"  height="290" fill="rgba(237,97,32,.09)"/>
                {[220,260,300,340,380].map(y=>[75,100,125].map(x=>(
                  <rect key={`${x}-${y}`} x={x} y={y} width="12" height="18" rx="1" fill="rgba(237,97,32,.28)"/>
                )))}
                {[140,180,220,260,300,340,380].map(y=>[170,200,230].map(x=>(
                  <rect key={`${x}-${y}`} x={x} y={y} width="14" height="20" rx="1" fill="rgba(237,97,32,.22)"/>
                )))}
                <rect x="0" y="450" width="400" height="50" fill="rgba(237,97,32,.06)"/>
                <line x1="320" y1="450" x2="320" y2="80"  stroke="rgba(237,97,32,.45)" strokeWidth="3"/>
                <line x1="320" y1="80"  x2="180" y2="80"  stroke="rgba(237,97,32,.45)" strokeWidth="3"/>
                <line x1="320" y1="80"  x2="380" y2="80"  stroke="rgba(237,97,32,.34)" strokeWidth="2"/>
                <line x1="260" y1="80"  x2="260" y2="140" stroke="rgba(237,97,32,.34)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <polygon points="200,30 220,70 180,70" fill="none" stroke="rgba(237,97,32,.55)" strokeWidth="1.5"/>
              </svg>

              <div className="absolute bottom-8 left-8 border rounded-sm p-4 backdrop-blur-[10px]"
                style={{ background:"rgba(7,11,20,.9)", borderColor:"rgba(237,97,32,.30)", animation:"floatY 4s ease-in-out infinite" }}>
                <div className="font-['Rajdhani'] text-[11px] tracking-[.1em] uppercase mb-1.5" style={{ color:"var(--primary)" }}>Membres actifs</div>
                <div className="font-['Rajdhani'] text-[28px] text-white font-semibold leading-none">67 entreprises</div>
              </div>

              <div className="absolute top-8 right-8 rounded-sm p-3" style={{ background:"var(--primary)" }}>
                <div className="font-['Rajdhani'] text-[10px] text-white/80 tracking-[.1em] mb-1">FONDÉE EN</div>
                <div className="font-['Rajdhani'] text-[24px] text-white tracking-[.05em] leading-none">2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity:0, animation:"fadeIn 1s ease 1.5s forwards" }}>
        <span className="font-['Rajdhani'] text-[10px] tracking-[.2em] text-white/30 uppercase">Défiler</span>
        <div className="w-6 h-9 border-[1.5px] border-white/20 rounded-xl flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-sm" style={{ background:"var(--primary)", animation:"floatY 1.5s ease-in-out infinite" }}/>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .hero-grid{ grid-template-columns:1fr!important; gap:48px!important; } }
      `}</style>
    </section>
  );
}
