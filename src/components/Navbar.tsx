"use client";
import { useState, useEffect } from "react";

interface Props { onOpenModal: () => void }

export default function Navbar({ onOpenModal }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { id: "accueil",     label: "Accueil" },
    { id: "about",       label: "À Propos" },
    { id: "services",    label: "Services" },
    { id: "partenaires", label: "Partenaires" },
    { id: "portfolio",   label: "Portfolio" },
    { id: "evenements",  label: "Événements" },
    { id: "contact",     label: "Contact" },
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-[1000] transition-all duration-400",
          scrolled
            ? "bg-[rgba(7,11,20,.88)] backdrop-blur-[22px] border-b border-[rgba(237,97,32,.18)] py-[14px]"
            : "bg-transparent py-[22px]",
        ].join(" ")}
      >
        <div className="max-w-[1280px] mx-auto px-10 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("accueil")} className="flex items-center gap-3 bg-transparent border-none cursor-pointer">
            <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
              <circle cx="20" cy="20" r="19" stroke="var(--gold)" strokeWidth="1.5"/>
              <circle cx="20" cy="20" r="13" stroke="var(--gold)" strokeWidth="1.2" opacity=".7"/>
              <circle cx="20" cy="20" r="7"  stroke="var(--gold)" strokeWidth="1"   opacity=".5"/>
              <circle cx="20" cy="20" r="2.5" fill="var(--gold)"/>
            </svg>
            <div className="text-left">
              <div className="font-['Rajdhani'] text-[22px] tracking-[.1em] text-white leading-none">UNIE-BTP</div>
              <div className="font-['Rajdhani'] text-[9px] tracking-[.15em] text-[--gold] uppercase leading-none mt-0.5">Unis pour construire</div>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="font-['Rajdhani'] text-[12px] font-[600] tracking-[.06em] uppercase text-white/70 hover:text-[--gold] transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com/uniebtp"
              aria-label="Facebook UNIE-BTP"
              className="hidden md:flex w-9 h-9 border border-white/20 rounded-full items-center justify-center text-white/60 hover:border-[--gold] hover:text-[--gold] transition-all duration-200"
            >
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a
              href="/login"
              className="hidden md:flex items-center gap-1 font-['Rajdhani'] text-[12px] font-[600] tracking-[.06em] uppercase text-white/60 hover:text-[--gold] transition-colors duration-200"
            >
              Connexion
            </a>
            <button onClick={onOpenModal} className="btn-gold text-[12px] py-[10px] px-[20px]">
              <span>Intégrer UNIE-BTP</span>
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
              aria-label="Menu"
            >
              <span className="block w-6 h-0.5 bg-white transition-all duration-300" style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span className="block w-6 h-0.5 bg-white transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
              <span className="block w-6 h-0.5 bg-white transition-all duration-300" style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 bg-[rgba(15,23,42,.98)]">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="font-['Rajdhani'] text-[40px] font-[600] text-white/90 hover:text-[--gold] transition-colors bg-transparent border-none cursor-pointer"
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => { setMenuOpen(false); onOpenModal(); }} className="btn-gold mt-4">
            <span>Intégrer UNIE-BTP</span>
          </button>
        </div>
      )}
    </>
  );
}
