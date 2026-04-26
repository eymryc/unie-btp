"use client";
import { useEffect, useRef } from "react";
const PARTNERS = [
  { name:"CNPS",          full:"Caisse Nationale de Prévoyance Sociale",   color:"#1a5f9c" },
  { name:"GNA-CI",        full:"Groupement National des Assureurs de CI",   color:"#2d8a4e" },
  { name:"LafargeHolcim", full:"LafargeHolcim Côte d'Ivoire",              color:"#e85d04" },
];
export default function Partners({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    }, { threshold:.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="partenaires" ref={ref} className="bg-white py-[100px] border-t border-[--border] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="text-center mb-[72px]">
          <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Ils nous font confiance</p>
          <h2 className="reveal font-['Rajdhani'] font-semibold text-[--navy] leading-[1.1] mb-5" style={{ fontSize:"clamp(36px,5vw,52px)" }}>
            Nos Partenaires Stratégiques
          </h2>
          <p className="reveal font-['Rajdhani'] text-[16px] text-[#718096] max-w-[500px] mx-auto leading-[1.7] text-justify">
            Des organisations de référence qui partagent notre vision du développement du secteur BTP en Côte d&apos;Ivoire.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-[72px] partners-grid">
          {PARTNERS.map((p,i) => (
            <div key={p.name} className="reveal border border-[--border] rounded-sm p-12 text-center transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_20px_60px_rgba(15,23,42,.12)]" style={{ transitionDelay:`${i*.1}s` }}>
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background:`${p.color}15`, border:`2px solid ${p.color}30` }}>
                <span className="font-['Rajdhani'] text-[18px]" style={{ color:p.color }}>{p.name.slice(0,3)}</span>
              </div>
              <h3 className="font-['Rajdhani'] text-[18px] font-bold text-[--navy] mb-2">{p.name}</h3>
              <p className="font-['Rajdhani'] text-[13px] text-[#a0aec0] leading-[1.5]">{p.full}</p>
            </div>
          ))}
        </div>
        {/* CTA */}
        <div className="reveal rounded-sm p-[60px_80px] flex items-center justify-between gap-10 relative overflow-hidden partner-cta"
          style={{ background:"linear-gradient(135deg,var(--night-2) 0%,var(--night-3) 100%)" }}>
          <div className="absolute right-[-60px] top-[-60px] w-[300px] h-[300px] rounded-full border border-[rgba(237,97,32,.18)]"/>
          <div className="relative z-[1]">
            <p className="text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Partenariat stratégique</p>
            <h3 className="font-['Rajdhani'] text-[36px] font-semibold text-white mb-4 leading-[1.2]">Devenez Partenaire UNIE-BTP</h3>
            <p className="font-['Rajdhani'] text-[15px] text-white/55 max-w-[480px] leading-[1.7] text-justify">
              Associez votre marque à la première organisation professionnelle du BTP en Côte d&apos;Ivoire
              et accédez à un réseau d&apos;entrepreneurs dynamiques.
            </p>
          </div>
          <div className="relative z-[1] flex-shrink-0">
            <button onClick={onOpenModal} className="btn-gold">
              <span>Nous contacter</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .partners-grid{ grid-template-columns:1fr 1fr!important; } .partner-cta{ flex-direction:column!important; padding:48px 36px!important; text-align:center!important; } }
        @media(max-width:600px){ .partners-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
