"use client";
import { useEffect, useRef, useState } from "react";
import BTPBlueprint3D from "@/components/BTPBlueprint3D";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name:"", company:"", email:"", phone:"", message:"" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el => el.classList.add("visible")); });
    }, { threshold:.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const inputCls = "w-full px-4 py-3 border border-[--border] rounded-sm font-['DM_Sans'] text-[14px] text-[--navy] placeholder:text-[#b0bac6] bg-white outline-none transition-colors duration-200 focus:border-[--gold]";
  const labelCls = "block font-['DM_Sans'] text-[11px] font-bold tracking-[.14em] uppercase text-[#a0aec0] mb-2";

  return (
    <section id="contact" ref={ref} className="bg-white py-[120px] relative overflow-hidden">
      <BTPBlueprint3D opacity={0.14} intensity={0.55} className="z-0" />
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="grid grid-cols-2 gap-20 contact-grid">

          {/* Left */}
          <div>
            <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Rejoindre l&apos;union</p>
            <h2 className="reveal font-['Cormorant_Garamond'] font-semibold text-[--navy] leading-[1.1] mb-7" style={{ fontSize:"clamp(36px,5vw,56px)" }}>
              Contactez<br/><span className="text-[--gold] italic">UNIE-BTP</span>
            </h2>
            <p className="reveal font-['DM_Sans'] text-[16px] text-[#718096] leading-[1.8] mb-12 text-justify">
              Rejoignez la communauté des entrepreneurs BTP les plus engagés de Côte d&apos;Ivoire.
              Ensemble, nous bâtissons un secteur plus fort, plus juste et plus prospère.
            </p>

            <div className="reveal flex flex-col gap-6 mb-12">
              {[
                { icon:<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>, label:"Email", value:"contact@unie-btp.com" },
                { icon:<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>, label:"Téléphone", value:"+225 07 09 60 62 86" },
                { icon:<><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></>, label:"Localisation", value:"Abidjan, Côte d'Ivoire" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[color:var(--gold-pale)] border border-[rgba(237,97,32,.22)] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24">{item.icon}</svg>
                  </div>
                  <div>
                    <div className="font-['DM_Sans'] text-[11px] font-bold tracking-[.1em] uppercase text-[#a0aec0] mb-0.5">{item.label}</div>
                    <div className="font-['DM_Sans'] text-[15px] text-[--navy] font-[500]">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal flex gap-3">
              {["Facebook","LinkedIn","Twitter"].map(s => (
                <a key={s} href="#" className="font-['DM_Sans'] text-[12px] font-bold tracking-[.08em] uppercase text-[--navy] no-underline px-[18px] py-[10px] border-[1.5px] border-[--border] rounded-sm transition-all duration-200 hover:border-[--gold] hover:text-[--gold]">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal">
            {sent ? (
              <div className="bg-[--bg] border border-[--border] border-t-[4px] border-t-[--gold] p-[60px_48px] text-center rounded-sm">
                <div className="w-16 h-16 mx-auto mb-6 bg-[color:var(--gold-pale)] border-2 border-[--gold] rounded-full flex items-center justify-center">
                  <svg width="28" height="28" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round"/></svg>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[32px] font-semibold text-[--navy] mb-4">Message envoyé</h3>
                <p className="font-['DM_Sans'] text-[15px] text-[#718096] leading-[1.7] text-justify">
                  Notre équipe vous contactera dans les 24 heures ouvrables pour discuter de votre adhésion à UNIE-BTP.
                </p>
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); setSent(true); }}
                className="bg-[--bg] border border-[--border] border-t-[4px] border-t-[--gold] p-12 rounded-sm"
              >
                <div className="mb-8">
                  <h3 className="font-['Cormorant_Garamond'] text-[28px] font-semibold text-[--navy] mb-2">Formulaire de contact</h3>
                  <p className="font-['DM_Sans'] text-[14px] text-[#718096]">Remplissez ce formulaire et nous vous recontactons rapidement.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className={labelCls}>Nom complet *</label><input required className={inputCls} placeholder="Votre nom" value={form.name} onChange={set("name")}/></div>
                  <div><label className={labelCls}>Entreprise *</label><input required className={inputCls} placeholder="Nom de l'entreprise" value={form.company} onChange={set("company")}/></div>
                </div>
                <div className="mb-4"><label className={labelCls}>Email *</label><input required type="email" className={inputCls} placeholder="votre@email.com" value={form.email} onChange={set("email")}/></div>
                <div className="mb-4"><label className={labelCls}>Téléphone</label><input type="tel" className={inputCls} placeholder="+225 07 00 00 00" value={form.phone} onChange={set("phone")}/></div>
                <div className="mb-7"><label className={labelCls}>Message</label>
                  <textarea rows={4} className={inputCls + " resize-y"} placeholder="Parlez-nous de votre entreprise..." value={form.message} onChange={set("message")}/>
                </div>

                <button type="submit" className="btn-gold w-full justify-center">
                  <span>Envoyer le message</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .contact-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
