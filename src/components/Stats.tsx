"use client";
import { useEffect, useRef, useState } from "react";
import BTPBlueprint3D from "@/components/BTPBlueprint3D";

function CountUp({ end, suffix="" }: { end:number; suffix?:string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60, inc = end / steps;
        let cur = 0;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= end) { setCount(end); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 1800 / steps);
      }
    }, { threshold:.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const STATS = [
  { value:67, suffix:"+", label:"Entrepreneurs Membres", desc:"Entreprises actives dans notre réseau" },
  { value:29, suffix:"",  label:"Participants SIGOMAP",  desc:"Séminaire de formation aux marchés publics" },
  { value:5,  suffix:"",  label:"Événements majeurs",    desc:"Organisés depuis notre création en 2023" },
  { value:3,  suffix:"",  label:"Axes d'intervention",   desc:"Protection · Formation · Représentation" },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); });
    }, { threshold:.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-[100px] relative overflow-hidden" style={{ background:"linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%)" }}>
      <BTPBlueprint3D opacity={0.22} intensity={0.65} className="z-[1]" />
      <div className="absolute inset-0 z-0" style={{ background:"radial-gradient(circle at 20% 50%,rgba(237,97,32,.10) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(237,97,32,.08) 0%,transparent 50%)" }}/>
      <div className="max-w-[1280px] mx-auto px-10 relative z-[1]">
        <div className="text-center mb-[72px]">
          <p className="reveal text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-4">Notre impact</p>
          <h2 className="reveal font-['Cormorant_Garamond'] font-semibold text-white leading-[1.1]" style={{ fontSize:"clamp(36px,5vw,52px)" }}>
            UNIE-BTP en Chiffres
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-px stats-grid" style={{ background:"rgba(237,97,32,.18)" }}>
          {STATS.map((s,i) => (
            <div key={s.label} className="reveal bg-[rgba(255,255,255,.03)] py-12 px-9 text-center" style={{ transitionDelay:`${i*.1}s` }}>
              <div className="font-['Cormorant_Garamond'] font-semibold text-[--gold] leading-none mb-4" style={{ fontSize:"clamp(52px,6vw,72px)" }}>
                <CountUp end={s.value} suffix={s.suffix}/>
              </div>
              <div className="font-['DM_Sans'] text-[14px] font-semibold text-white mb-2 tracking-[.02em]">{s.label}</div>
              <div className="font-['DM_Sans'] text-[13px] text-white/35 leading-[1.5]">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){ .stats-grid{ grid-template-columns:1fr 1fr!important; } }
        @media(max-width:480px){ .stats-grid{ grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
