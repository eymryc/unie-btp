"use client";
import { useEffect, useRef, useState } from "react";
const CATS = ["Tous","Infrastructure","Bâtiment","Génie Civil"];
const PROJECTS = [
  { id:1, title:"Infrastructure Routière",   cat:"Infrastructure", desc:"Réhabilitation de voirie urbaine",         color:"linear-gradient(135deg,var(--night-2) 0%,var(--night-3) 100%)" },
  { id:2, title:"Complexe Résidentiel",      cat:"Bâtiment",       desc:"Immeuble R+4, 24 logements",               color:"linear-gradient(135deg,var(--night) 0%,var(--night-2) 100%)" },
  { id:3, title:"Pont & Ouvrage d'Art",      cat:"Génie Civil",    desc:"Ouvrage hydraulique, 80 m",               color:"linear-gradient(135deg,var(--night-3) 0%,var(--night) 100%)" },
  { id:4, title:"Centre Commercial",         cat:"Bâtiment",       desc:"Surface 3 200 m², Abidjan",               color:"var(--night)" },
  { id:5, title:"Réseau d'Assainissement",   cat:"Infrastructure", desc:"Collecteur principal, 2,5 km",             color:"linear-gradient(135deg,var(--night-2) 0%,var(--night-3) 100%)" },
  { id:6, title:"Immeuble de Bureaux",       cat:"Bâtiment",       desc:"Siège social R+6, Plateau",               color:"linear-gradient(135deg,var(--night) 0%,var(--night-2) 100%)" },
  { id:7, title:"Aménagement Portuaire",     cat:"Génie Civil",    desc:"Extension quai industriel",               color:"linear-gradient(135deg,var(--night-3) 0%,var(--night) 100%)" },
  { id:8, title:"Cité Universitaire",        cat:"Bâtiment",       desc:"480 chambres, campus moderne",            color:"var(--night)" },
];
export default function Portfolio({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("Tous");
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    }, { threshold:.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const filtered = active === "Tous" ? PROJECTS : PROJECTS.filter(p => p.cat === active);
  return (
    <section id="portfolio" ref={ref} className="py-[120px] relative overflow-hidden" style={{ background:"var(--night)" }}>
      <div className="grid-texture" />
      <div className="max-w-[1280px] mx-auto px-10 relative z-[1]">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-8">
          <div>
            <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Réalisations membres</p>
            <h2 className="reveal font-['Rajdhani'] font-semibold text-white leading-[1.1]" style={{ fontSize:"clamp(36px,5vw,56px)" }}>
              Nos Plus Belles<br/><span className="text-[--gold] italic">Réalisations</span>
            </h2>
          </div>
          <div className="reveal flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setActive(c)}
                className="font-['Rajdhani'] text-[12px] font-bold tracking-[.08em] uppercase px-5 py-[10px] cursor-pointer transition-all duration-200 rounded-sm"
                style={{
                  border: active===c ? "1.5px solid var(--gold)" : "1.5px solid rgba(255,255,255,.15)",
                  background: active===c ? "var(--gold)" : "transparent",
                  color: active===c ? "#fff" : "rgba(255,255,255,.5)"
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-px portfolio-grid">
          {filtered.map((p,i) => (
            <div key={p.id} className="reveal group relative overflow-hidden cursor-pointer" style={{ aspectRatio:"1", background:p.color, transitionDelay:`${(i%4)*.08}s` }}>
              <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(237,97,32,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(237,97,32,.06) 1px,transparent 1px)", backgroundSize:"20px 20px" }}/>
              <div className="absolute inset-0 flex items-center justify-center opacity-[.12]">
                <svg width="72" height="72" fill="none" stroke="var(--gold)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="absolute top-4 left-4 font-['Rajdhani'] text-[10px] font-bold tracking-[.08em] uppercase text-[--gold] bg-[color:var(--gold-pale)] border border-[rgba(237,97,32,.28)] rounded-sm px-[10px] py-1">{p.cat}</div>
              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 text-center" style={{ background:"rgba(237,97,32,.92)" }}>
                <h3 className="font-['Rajdhani'] text-[22px] font-semibold text-[--navy] mb-2">{p.title}</h3>
                <p className="font-['Rajdhani'] text-[13px] text-[rgba(15,23,42,.75)]">{p.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[rgba(15,23,42,.85)] to-transparent">
                <div className="font-['Rajdhani'] text-[13px] font-semibold text-white">{p.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal text-center mt-14">
          <p className="font-['Rajdhani'] text-[14px] text-white/35 mb-6">Parcourez les réalisations des entreprises membres d&apos;UNIE-BTP</p>
          <button onClick={onOpenModal} className="btn-gold"><span>Intégrer notre réseau</span></button>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .portfolio-grid{ grid-template-columns:repeat(2,1fr)!important; } }
      `}</style>
    </section>
  );
}
