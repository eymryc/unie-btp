"use client";


interface Props { onOpenModal: () => void }

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

export default function Footer({ onOpenModal }: Props) {
  const nav = [
    { id:"accueil",     label:"Accueil" },
    { id:"about",       label:"À Propos" },
    { id:"services",    label:"Services" },
    { id:"partenaires", label:"Partenaires" },
    { id:"portfolio",   label:"Portfolio" },
  ];
  const resources = [
    { id:"evenements", label:"Nos Événements" },
    { id:"faq",        label:"FAQ" },
    { id:"contact",    label:"Contact" },
  ];

  return (
    <footer style={{ background:"var(--night)" }} className="border-t border-[rgba(237,97,32,.15)] relative overflow-hidden">
      <div className="grid-texture" style={{ opacity:.5 }} />
      {/* Main */}
      <div className="max-w-[1280px] mx-auto px-10 py-20 grid grid-cols-[2fr_1fr_1fr_1fr] gap-[60px] footer-grid relative z-[1]">
        {/* Brand */}
        <div>
          <button onClick={() => scrollTo("accueil")} className="flex items-center gap-3 mb-6 bg-transparent border-none cursor-pointer">
            <svg viewBox="0 0 40 40" fill="none" width="34" height="34">
              <circle cx="20" cy="20" r="19" stroke="var(--gold)" strokeWidth="1.5"/>
              <circle cx="20" cy="20" r="13" stroke="var(--gold)" strokeWidth="1.2" opacity=".7"/>
              <circle cx="20" cy="20" r="7"  stroke="var(--gold)" strokeWidth="1"   opacity=".5"/>
              <circle cx="20" cy="20" r="2.5" fill="var(--gold)"/>
            </svg>
            <div className="text-left">
              <div className="font-['Rajdhani'] text-[21px] tracking-[.1em] text-white leading-none">UNIE-BTP</div>
              <div className="font-['Rajdhani'] text-[9px] tracking-[.15em] text-[--gold] uppercase leading-none mt-0.5">Unis pour construire</div>
            </div>
          </button>
          <p className="font-['Rajdhani'] text-[14px] leading-[1.8] text-white/35 mb-8 max-w-[280px] text-justify">
            L&apos;Union Solidaire des Entrepreneurs de BTP en Côte d&apos;Ivoire. Fondée en 2023, nous œuvrons pour un secteur BTP plus fort, plus équitable et plus prospère.
          </p>
          <div className="flex gap-2.5">
            {["F","Li","Tw"].map((s, i) => (
              <a key={i} href="#" aria-label={["Facebook","LinkedIn","Twitter"][i]}
                className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center font-['Rajdhani'] text-[10px] font-bold text-white/40 no-underline transition-all duration-200 hover:border-[--gold] hover:text-[--gold]">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="font-['Rajdhani'] text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-6">Navigation</div>
          <div className="flex flex-col gap-3">
            {nav.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className="font-['Rajdhani'] text-[14px] text-white/35 bg-transparent border-none cursor-pointer text-left hover:text-[--gold] transition-colors duration-200">
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <div className="font-['Rajdhani'] text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-6">Ressources</div>
          <div className="flex flex-col gap-3">
            {resources.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className="font-['Rajdhani'] text-[14px] text-white/35 bg-transparent border-none cursor-pointer text-left hover:text-[--gold] transition-colors duration-200">
                {l.label}
              </button>
            ))}
            <button onClick={onOpenModal}
              className="font-['Rajdhani'] text-[14px] text-[--gold] bg-transparent border-none cursor-pointer text-left hover:text-[--gold-light] transition-colors duration-200 font-semibold mt-1">
              Intégrer UNIE-BTP
            </button>
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="font-['Rajdhani'] text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-6">Contact</div>
          <div className="flex flex-col gap-4">
            {[
              { label:"Email", value:"contact@unie-btp.com" },
              { label:"Téléphone", value:"+225 07 09 60 62 86" },
              { label:"Localisation", value:"Abidjan, Côte d'Ivoire" },
            ].map(c => (
              <div key={c.label}>
                <div className="font-['Rajdhani'] text-[11px] text-white/25 mb-0.5">{c.label}</div>
                <div className="font-['Rajdhani'] text-[14px] text-white/55">{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[.05] py-6 px-10 max-w-[1280px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <p className="font-['Rajdhani'] text-[13px] text-white/20">
          © 2024 UNIE-BTP — Union Solidaire des Entrepreneurs de BTP en Côte d&apos;Ivoire. Tous droits réservés.
        </p>
        <p className="font-['Rajdhani'] text-[13px] text-white/15 italic">
          Unis pour construire, au service du progrès.
        </p>
      </div>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/2250709606286" aria-label="WhatsApp UNIE-BTP" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-[52px] h-[52px] rounded-full flex items-center justify-center z-[900] transition-all duration-200 hover:scale-110"
        style={{ background:"#25D366", boxShadow:"0 8px 32px rgba(37,211,102,.35)" }}>
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      <style>{`
        @media(max-width:900px){ .footer-grid{ grid-template-columns:1fr 1fr!important; } }
        @media(max-width:480px){ .footer-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </footer>
  );
}
