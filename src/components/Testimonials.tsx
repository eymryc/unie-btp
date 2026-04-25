"use client";
import { useEffect, useRef } from "react";
import BTPBlueprint3D from "@/components/BTPBlueprint3D";
const TESTIMONIALS = [
  { quote:"L'UNIE-BTP est une organisation indispensable pour la protection, l'accompagnement et la défense des entreprises du secteur du bâtiment. Leur soutien est inestimable pour le développement de notre secteur.", name:"M. Konan KAN", role:"Président de UNIE-BTP", initials:"KK", color:"var(--gold)" },
  { quote:"Grâce aux formations sur les marchés publics via UNIE-BTP, nous avons pu comprendre et saisir des opportunités d'affaires considérables. C'est un accompagnement qui change véritablement la donne pour les PME.", name:"Participant", role:"Séminaire SIGOMAP", initials:"SP", color:"#2d8a4e" },
  { quote:"L'objectif de l'UNIE-BTP est de défendre les intérêts de ses membres et de promouvoir la santé des travailleurs du BTP. C'est une plateforme qui prône réellement la solidarité entre acteurs du secteur.", name:"Entrepreneur Membre", role:"Directeur d'entreprise BTP", initials:"EM", color:"#1a5f9c" },
  { quote:"En tant que membre de l'UNIE-BTP, j'apprécie particulièrement l'entraide et la solidarité qui règnent au sein de l'organisation. C'est une union qui comprend vraiment les besoins du secteur BTP.", name:"Entrepreneur BTP", role:"Membre UNIE-BTP", initials:"EB", color:"#6b46c1" },
];
export default function Testimonials({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    }, { threshold:.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className="py-[120px] relative overflow-hidden" style={{ background:"var(--navy)" }}>
      <BTPBlueprint3D opacity={0.18} intensity={0.65} className="z-0" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[rgba(237,97,32,.08)] pointer-events-none"/>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[rgba(237,97,32,.06)] pointer-events-none"/>
      <div className="max-w-[1280px] mx-auto px-10 relative z-[1]">
        <div className="text-center mb-20">
          <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Ils témoignent</p>
          <h2 className="reveal font-['Cormorant_Garamond'] font-semibold text-white leading-[1.1]" style={{ fontSize:"clamp(36px,5vw,56px)" }}>
            Témoignages de nos membres<br/><span className="text-[--gold] italic">sur UNIE-BTP</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6 testimonials-grid">
          {TESTIMONIALS.map((t,i) => (
            <div key={t.name}
              className="reveal bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.06)] p-[40px_36px] rounded-sm transition-all duration-350 hover:bg-[rgba(255,255,255,.07)] hover:-translate-y-1 cursor-default"
              style={{ borderLeft:`3px solid ${t.color}`, transitionDelay:`${(i%2)*.1}s` }}>
              <div className="font-['Cormorant_Garamond'] text-[80px] leading-[.8] mb-5 opacity-50" style={{ color:t.color }}>&ldquo;</div>
              <p className="font-['Cormorant_Garamond'] text-[20px] italic leading-[1.65] text-white/80 mb-8 text-justify">{t.quote}</p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:`${t.color}20`, border:`1.5px solid ${t.color}50` }}>
                  <span className="font-['DM_Sans'] text-[13px] font-bold" style={{ color:t.color }}>{t.initials}</span>
                </div>
                <div>
                  <div className="font-['DM_Sans'] text-[14px] font-semibold text-white">{t.name}</div>
                  <div className="font-['DM_Sans'] text-[12px]" style={{ color:t.color }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal text-center mt-16">
          <button onClick={onOpenModal} className="btn-gold">
            <span>Intégrer UNIE-BTP</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){ .testimonials-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
