"use client";
import { useEffect, useRef } from "react";

const SERVICES = [
  { n:"01", title:"Formation & Développement", desc:"Ateliers spécialisés dispensés par des experts pour maîtriser les dernières techniques de construction, la gestion de projet et le leadership entrepreneurial.", feats:["Techniques de construction avancées","Gestion de projet & leadership","Nouvelles réglementations BTP"] },
  { n:"02", title:"Représentation & Droits", desc:"Défense active de vos intérêts auprès des autorités gouvernementales et organismes de réglementation pour simplifier les procédures administratives.", feats:["Lobbying institutionnel","Simplification administrative","Accès aux marchés publics"] },
  { n:"03", title:"Réseautage & Échanges", desc:"Organisation d'événements et rencontres professionnelles exclusifs permettant aux entrepreneurs de développer leur réseau et créer des opportunités commerciales.", feats:["Événements exclusifs membres","Partenariats stratégiques","Plateforme d'échanges"] },
  { n:"04", title:"Accès aux Financements", desc:"Facilitation de l'accès aux financements avantageux via des partenariats bancaires privilégiés et un accompagnement complet pour les appels d'offres publics.", feats:["Partenariats bancaires préférentiels","Fonds de garantie solidaire","Accompagnement appels d'offres"] },
  { n:"05", title:"Protection Sociale", desc:"Mutuelle santé dédiée aux entrepreneurs et travailleurs BTP, gestion des retraites et fonds de solidarité pour sécuriser l'avenir de nos membres.", feats:["Mutuelle santé collective","Gestion des retraites","Fonds de solidarité d'urgence"] },
  { n:"06", title:"Support Juridique", desc:"Notre équipe juridique spécialisée vous accompagne dans vos contentieux, la révision de contrats et vous conseille sur les aspects réglementaires du secteur BTP.", feats:["Conseil juridique spécialisé","Révision & rédaction contrats","Contentieux & recouvrement"] },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    }, { threshold:.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" ref={ref} className="py-[120px] relative overflow-hidden" style={{ background:"var(--bg)" }}>
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="text-center mb-20">
          <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Ce que nous offrons</p>
          <h2 className="reveal font-['Rajdhani'] font-semibold text-[--navy] leading-[1.1] mb-6" style={{ fontSize:"clamp(36px,5vw,56px)" }}>
            Nos axes d&apos;intervention
          </h2>
          <p className="reveal font-['Rajdhani'] text-[17px] text-[#718096] max-w-[560px] mx-auto leading-[1.7] text-justify">
            Un accompagnement 360° pour propulser votre entreprise BTP vers l&apos;excellence et la croissance durable.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-px services-grid" style={{ background:"rgba(15,23,42,.06)" }}>
          {SERVICES.map((s,i) => (
            <div
              key={s.n}
              className="reveal bg-white p-[44px_36px] relative overflow-hidden cursor-default group transition-all duration-350"
              style={{ transitionDelay:`${(i%3)*.1}s` }}
            >
              <div className="font-['Rajdhani'] text-[72px] font-bold text-[rgba(15,23,42,.05)] leading-none absolute top-5 right-7 select-none group-hover:text-[rgba(237,97,32,.18)] transition-colors duration-350">{s.n}</div>
              <div className="w-8 h-8 rounded-sm bg-[color:var(--gold-pale)] flex items-center justify-center mb-6 group-hover:bg-[rgba(237,97,32,.22)] transition-colors">
                <svg width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-['Rajdhani'] text-[24px] font-semibold text-[--navy] mb-4 leading-[1.2] group-hover:text-[--navy] transition-colors">{s.title}</h3>
              <p className="font-['Rajdhani'] text-[14px] leading-[1.75] text-[#718096] mb-6 text-justify">{s.desc}</p>
              <div className="flex flex-col gap-2">
                {s.feats.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[--gold] flex-shrink-0"/>
                    <span className="font-['Rajdhani'] text-[12px] text-[#718096]">{f}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[--gold] to-[--gold-light] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-350"/>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .services-grid{ grid-template-columns:1fr 1fr!important; } }
        @media(max-width:600px){ .services-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
