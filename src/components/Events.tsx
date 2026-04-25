"use client";
import { useEffect, useRef } from "react";
import BTPBlueprint3D from "@/components/BTPBlueprint3D";
const EVENTS = [
  { month:"NOV", day:"30", year:"2024", title:"Assemblée Générale Annuelle 2024", desc:"Adoption des rapports moral et financier, élection du bureau et définition des orientations stratégiques pour 2025.", tags:["Gouvernance","Stratégie"], type:"Assemblée", color:"#c9973a" },
  { month:"JUN", day:"20", year:"2024", title:"Séminaire de Formation SIGOMAP",   desc:"Formation approfondie sur le Système d'Information et de Gestion des Opérations des Marchés Publics, avec 29 participants.", tags:["Formation","Marchés Publics"], type:"Formation", color:"#2d8a4e" },
  { month:"AOÛ", day:"10", year:"2023", title:"Petit-Déjeuner Débat — Marchés Publics", desc:"Échanges stratégiques sur l'accès aux opportunités des marchés publics pour les PME du secteur BTP ivoirien.", tags:["Networking","Marchés Publics"], type:"Débat", color:"#1a5f9c" },
  { month:"JUN", day:"08", year:"2023", title:"Lancement Officiel de l'UNIE-BTP", desc:"Cérémonie de lancement marquant la naissance de l'Union Solidaire des Entrepreneurs de BTP en Côte d'Ivoire.", tags:["Inauguration","Historique"], type:"Lancement", color:"#c9973a" },
  { month:"JUN", day:"08", year:"2023", title:"Conférence de Presse de Présentation", desc:"Présentation officielle de l'UNIE-BTP aux médias nationaux et aux acteurs clés du secteur du bâtiment ivoirien.", tags:["Communication","Médias"], type:"Presse", color:"#6b46c1" },
];
export default function Events() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    }, { threshold:.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="evenements" ref={ref} className="py-[120px] relative overflow-hidden" style={{ background:"var(--bg)" }}>
      <BTPBlueprint3D opacity={0.13} intensity={0.55} className="z-0" />
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="text-center mb-20">
          <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Actualités & agenda</p>
          <h2 className="reveal font-['Cormorant_Garamond'] font-semibold text-[--navy] leading-[1.1] mb-5" style={{ fontSize:"clamp(36px,5vw,56px)" }}>
            Nos Événements
          </h2>
          <p className="reveal font-['DM_Sans'] text-[16px] text-[#718096] max-w-[500px] mx-auto leading-[1.7] text-justify">
            Restez connecté à l&apos;actualité de UNIE-BTP. Formations, assemblées, réseautage : des événements pensés pour votre croissance.
          </p>
        </div>

        {/* Featured */}
        <div className="reveal rounded-sm mb-8 grid gap-[60px] items-center relative overflow-hidden featured-event"
          style={{ background:"var(--navy)", padding:"60px 64px", gridTemplateColumns:"auto 1fr" }}>
          <BTPBlueprint3D opacity={0.2} intensity={0.7} className="z-0" />
          <div className="absolute top-[-40px] right-[-40px] w-[300px] h-[300px] rounded-full" style={{ background:"radial-gradient(circle,rgba(237,97,32,.10) 0%,transparent 70%)" }}/>
          <div className="text-center bg-[--gold] p-[24px_32px] rounded-sm flex-shrink-0">
            <div className="font-['DM_Sans'] text-[11px] font-bold tracking-[.2em] uppercase text-white/80 mb-2">{EVENTS[0].month}</div>
            <div className="font-['Cormorant_Garamond'] text-[56px] font-bold text-white leading-none">{EVENTS[0].day}</div>
            <div className="font-['DM_Sans'] text-[14px] text-white/80 mt-1">{EVENTS[0].year}</div>
          </div>
          <div className="relative z-[1]">
            <div className="flex gap-2 mb-5 flex-wrap">
              <span className="font-['DM_Sans'] text-[10px] font-bold tracking-[.15em] uppercase text-[--gold] bg-[color:var(--gold-pale)] px-3 py-1 rounded-sm">Événement récent</span>
              {EVENTS[0].tags.map(t => <span key={t} className="font-['DM_Sans'] text-[10px] tracking-[.1em] uppercase text-white/40 bg-[rgba(255,255,255,.06)] px-3 py-1 rounded-sm">{t}</span>)}
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-[36px] font-semibold text-white mb-5 leading-[1.2]">{EVENTS[0].title}</h3>
            <p className="font-['DM_Sans'] text-[15px] leading-[1.75] text-white/55 max-w-[560px] text-justify">{EVENTS[0].desc}</p>
          </div>
        </div>

        {/* Others */}
        <div className="grid grid-cols-2 gap-px events-grid" style={{ background:"rgba(15,23,42,.06)" }}>
          {EVENTS.slice(1).map((ev,i) => (
            <div key={ev.title}
              className="reveal bg-white p-[36px_40px] grid gap-7 items-start transition-colors duration-200 hover:bg-[--bg] cursor-pointer"
              style={{ gridTemplateColumns:"auto 1fr", transitionDelay:`${(i%2)*.1}s` }}>
              <div className="text-center min-w-[52px]">
                <div className="font-['DM_Sans'] text-[10px] font-bold tracking-[.1em] uppercase mb-1" style={{ color:ev.color }}>{ev.month}</div>
                <div className="font-['Cormorant_Garamond'] text-[36px] font-bold text-[--navy] leading-none">{ev.day}</div>
                <div className="w-6 h-[2px] mx-auto mt-2" style={{ background:ev.color }}/>
              </div>
              <div>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {ev.tags.map(t => <span key={t} className="font-['DM_Sans'] text-[10px] tracking-[.08em] uppercase text-[#a0aec0] bg-[#f1f5f9] px-2 py-0.5 rounded-sm">{t}</span>)}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[22px] font-semibold text-[--navy] mb-3 leading-[1.3]">{ev.title}</h3>
                <p className="font-['DM_Sans'] text-[13px] leading-[1.7] text-[#718096] text-justify">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .events-grid{ grid-template-columns:1fr!important; } .featured-event{ grid-template-columns:1fr!important; padding:40px 32px!important; text-align:center!important; } }
      `}</style>
    </section>
  );
}
