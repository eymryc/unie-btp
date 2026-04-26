"use client";
import { useEffect, useRef, useState } from "react";
const FAQS = [
  { q:"Comment devenir membre d'UNIE-BTP ?", a:"Pour devenir membre, votre entreprise doit être légalement constituée et exercer dans le secteur du BTP. Contactez-nous pour initier la procédure d'adhésion. Notre équipe vous accompagne à chaque étape pour que vous puissiez rapidement bénéficier de l'ensemble de nos services." },
  { q:"Quels sont les avantages de l'adhésion ?", a:"Les membres bénéficient d'une mutuelle santé collective, d'un accompagnement financier, d'une assistance juridique spécialisée, de formations professionnelles régulières et d'un accès privilégié aux appels d'offres publics. Vous intégrez également un réseau d'entrepreneurs solidaires." },
  { q:"Quel est le coût de l'adhésion ?", a:"Les frais d'adhésion sont calculés selon la taille et le chiffre d'affaires de votre entreprise. Nous proposons des options flexibles et progressives pour permettre à toutes les entreprises BTP de rejoindre notre réseau, des TPE aux entreprises de taille intermédiaire." },
  { q:"Quels services de formation proposez-vous ?", a:"Nous organisons régulièrement des formations en gestion d'entreprise, sécurité au travail, nouvelles technologies et réglementations du secteur BTP. Des séminaires spécialisés comme la formation SIGOMAP sur les marchés publics sont également organisés avec nos partenaires institutionnels." },
  { q:"Comment fonctionne le support juridique ?", a:"Notre équipe juridique spécialisée vous accompagne dans vos contentieux commerciaux, la révision et rédaction de contrats, le recouvrement des impayés et vous conseille sur tous les aspects réglementaires du secteur BTP. Ce service est inclus dans votre adhésion." },
  { q:"Comment UNIE-BTP facilite l'accès aux marchés publics ?", a:"Nous organisons des formations sur les procédures de marchés publics, informons nos membres des appels d'offres pertinents, intervenons auprès des autorités pour simplifier les conditions d'accès et accompagnons vos candidatures pour maximiser vos chances de succès." },
];
export default function FAQ({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number|null>(0);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    }, { threshold:.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="faq" ref={ref} className="py-[120px] relative overflow-hidden" style={{ background:"var(--bg)" }}>
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="grid grid-cols-[1fr_2fr] gap-[100px] items-start faq-grid">
          <div className="sticky top-[120px]">
            <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Questions fréquentes</p>
            <h2 className="reveal font-['Rajdhani'] font-semibold text-[--navy] leading-[1.1] mb-7" style={{ fontSize:"clamp(32px,4vw,48px)" }}>
              Tout ce que vous devez savoir
            </h2>
            <p className="reveal font-['Rajdhani'] text-[15px] text-[#718096] leading-[1.75] mb-10 text-justify">
              Découvrez les réponses aux questions les plus courantes sur UNIE-BTP, nos services et notre démarche d&apos;accompagnement des professionnels du BTP.
            </p>
            <div className="reveal">
              <button onClick={onOpenModal} className="btn-gold"><span>Devenir membre</span></button>
            </div>
          </div>
          <div className="flex flex-col gap-px">
            {FAQS.map((f,i) => (
              <div key={f.q} className="reveal bg-white transition-all duration-300" style={{ borderLeft: open===i ? "3px solid var(--gold)" : "3px solid transparent", transitionDelay:`${i*.06}s` }}>
                <button onClick={() => setOpen(open===i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-7 py-6 bg-transparent border-none cursor-pointer text-left">
                  <span className="font-['Rajdhani'] text-[20px] font-semibold text-[--navy] leading-[1.3]">{f.q}</span>
                  <div className="w-7 h-7 border-[1.5px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{ borderColor: open===i ? "var(--gold)" : "var(--border)", transform: open===i ? "rotate(45deg)" : "none" }}>
                    <svg width="12" height="12" fill="none" stroke={open===i ? "var(--gold)" : "#718096"} strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </div>
                </button>
                {open===i && (
                  <div className="px-7 pb-7">
                    <p className="font-['Rajdhani'] text-[15px] leading-[1.8] text-[#718096] text-justify">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .faq-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
