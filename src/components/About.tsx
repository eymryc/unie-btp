"use client";
import { useEffect, useRef } from "react";

const VALUES = [
  { title:"Solidarité", desc:"La force réside dans l'union. Chaque membre bénéficie du soutien collectif de l'ensemble du réseau UNIE-BTP." },
  { title:"Équité", desc:"Nous défendons un accès juste et transparent aux marchés publics pour toutes les entreprises du secteur." },
  { title:"Excellence", desc:"Nous promouvons les plus hauts standards de qualité, de professionnalisme et d'innovation dans la construction." },
  { title:"Durabilité", desc:"Nous œuvrons pour un développement responsable respectant les normes environnementales et sociales du secteur." },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el => el.classList.add("visible"));
      });
    }, { threshold:.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="py-[120px] relative overflow-hidden" style={{ background:"var(--surface)" }}>
      <div className="grid-texture-light" />
      <div className="max-w-[1280px] mx-auto px-10 relative z-[1]">

        {/* Header */}
        <div className="grid grid-cols-2 gap-[80px] items-start mb-[100px] about-header">
          <div>
            <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-5">Notre identité</p>
            <h2 className="reveal font-['Rajdhani'] font-semibold text-[--navy] leading-[1.1]" style={{ fontSize:"clamp(36px,5vw,56px)" }}>
              Qui Sommes-nous&nbsp;?
            </h2>
          </div>
          <div className="reveal pt-3">
            <div className="w-14 h-[2px] bg-[--gold] mb-7" />
            <p className="font-['Rajdhani'] text-[17px] leading-[1.8] text-[#4a5568] mb-6 text-justify">
              L&apos;<strong>UNIE-BTP</strong> est l&apos;organisation de référence dédiée à la protection,
              l&apos;accompagnement et la défense des droits des entreprises du bâtiment et des
              travaux publics en Côte d&apos;Ivoire.
            </p>
            <p className="font-['Rajdhani'] text-[16px] leading-[1.8] text-[#718096] text-justify">
              Face aux défis structurels d&apos;un secteur en pleine mutation, nous nous positionnons
              comme le porte-parole incontournable en rassemblant les forces vives du métier.
              Ensemble, nous relevons les défis que nul ne peut surmonter seul.
            </p>
          </div>
        </div>

        {/* Mission / Services */}
        <div
          className="grid grid-cols-2 gap-px mb-[100px] about-split rounded-[12px] overflow-hidden border border-[--border] shadow-[0_22px_70px_rgba(15,23,42,.10)]"
          style={{ background: "var(--muted)" }}
        >
          <div
            className="reveal-left p-[60px_52px] relative overflow-hidden"
            style={{ background: "linear-gradient(140deg,var(--navy) 0%,var(--navy-mid) 100%)" }}
          >
            <div className="absolute inset-0" style={{ background:"radial-gradient(circle at 20% 20%,rgba(237,97,32,.16),transparent 55%)" }}/>
            <p className="text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-6">Notre Mission</p>
            <h3 className="font-['Rajdhani'] text-[36px] font-semibold text-white mb-6 leading-[1.2]">Défendre &amp;<br/>Soutenir</h3>
            <p className="font-['Rajdhani'] text-[15px] leading-[1.8] text-white/70 mb-8 text-justify relative">
              Notre mission est de défendre les intérêts de nos membres, promouvoir la santé
              et le bien-être des travailleurs du BTP, et mettre en place des fonds de garantie
              pour soutenir les entreprises du secteur. Nous croyons en la force du collectif
              pour relever les défis de notre industrie.
            </p>
          </div>
          <div className="reveal-right p-[60px_52px]" style={{ background: "linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%)" }}>
            <p className="text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-6">Nos Services</p>
            <h3 className="font-['Rajdhani'] text-[36px] font-semibold text-[--navy] mb-6 leading-[1.2]">Un Accompagnement<br/>Complet</h3>
            <div className="flex flex-col gap-4">
              {["Mutuelle santé & gestion des retraites","Formation et gestion des ressources humaines","Accompagnement au financement bancaire","Gestion comptable & contentieux des impayés","Accès privilégié aux marchés publics","Fonds de solidarité pour les membres"].map(s => (
                <div key={s} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[--gold] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span className="font-['Rajdhani'] text-[14px] text-[color:var(--text-muted)] leading-[1.6]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="reveal text-center mb-16">
          <p className="text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Ce qui nous anime</p>
          <h2 className="font-['Rajdhani'] font-semibold text-[--navy] leading-[1.1]" style={{ fontSize:"clamp(36px,5vw,52px)" }}>
            Les Valeurs que nous<br/>portons et défendons
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-6 stagger values-grid">
          {VALUES.map(v => (
            <div key={v.title} className="reveal bg-white border border-[--border] border-t-[3px] border-t-[--gold] p-9 rounded-sm transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_20px_60px_rgba(15,23,42,.12)]">
              <div className="w-8 h-8 bg-[color:var(--gold-pale)] rounded-sm flex items-center justify-center mb-5">
                <svg width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-['Rajdhani'] text-[22px] font-semibold text-[--navy] mb-3">{v.title}</h3>
              <p className="font-['Rajdhani'] text-[14px] leading-[1.75] text-[#718096] text-justify">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .about-header,.about-split{ grid-template-columns:1fr!important; } }
        @media(max-width:900px){ .values-grid{ grid-template-columns:1fr 1fr!important; } }
        @media(max-width:480px){ .values-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
