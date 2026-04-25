"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ─── Schemas ─────────────────────────────────────────────── */
const step1Schema = z.object({
  companyName: z.string().min(2, "Minimum 2 caractères"),
  registrationNumber: z.string().min(3, "Numéro requis"),
  taxId: z.string().min(3, "NIF requis"),
  sector: z.string().min(1, "Sélectionnez un secteur"),
  foundingDate: z.string().min(1, "Date requise"),
});

const step2Schema = z.object({
  companyEmail: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro invalide"),
  website: z.string().optional(),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  country: z.string().min(2, "Pays requis"),
});

const step3Schema = z
  .object({
    ceoName: z.string().min(2, "Nom requis"),
    ceoEmail: z.string().email("Email invalide"),
    ceoPhone: z.string().min(8, "Numéro invalide"),
    password: z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string().min(8, "Confirmation requise"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

const SECTORS = [
  "Bâtiment Résidentiel",
  "Génie Civil",
  "Travaux Publics",
  "Construction Industrielle",
  "Électricité & Plomberie",
  "Menuiserie & Charpente",
  "Peinture & Revêtement",
  "Architecture & Études",
  "Autre",
];

const STEPS = [
  { label: "Entreprise", sub: "Informations de l'entreprise" },
  { label: "Contact",    sub: "Informations de contact" },
  { label: "Compte",     sub: "Informations du dirigeant et du compte" },
];

/* ─── Input component ─────────────────────────────────────── */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold tracking-[.14em] uppercase text-[#7a8aa0]">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[12px] text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
}

function Input({
  register,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  error?: string;
}) {
  return (
    <input
      {...props}
      {...register}
      className={[
        "w-full px-4 py-3 rounded-sm border text-[14px] font-['DM_Sans'] text-[--navy]",
        "placeholder:text-[#b0bac6] bg-white outline-none transition-all duration-200",
        error
          ? "border-red-400 focus:border-red-500"
          : "border-[--border] focus:border-[--gold]",
      ].join(" ")}
    />
  );
}

function Select({
  register,
  error,
  options,
  placeholder,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  error?: string;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      {...register}
      className={[
        "w-full px-4 py-3 rounded-sm border text-[14px] font-['DM_Sans'] text-[--navy] bg-white",
        "outline-none transition-all duration-200 cursor-pointer appearance-none",
        error
          ? "border-red-400 focus:border-red-500"
          : "border-[--border] focus:border-[--gold]",
      ].join(" ")}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ─── Progress bar ────────────────────────────────────────── */
function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="relative h-[3px] bg-[rgba(15,23,42,.08)] rounded-full overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full bg-[--gold] transition-all duration-500 ease-out"
        style={{ width: `${pct === 0 ? 20 : pct}%` }}
      />
    </div>
  );
}

/* ─── Step indicators ─────────────────────────────────────── */
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <div
            className={[
              "flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold transition-all duration-300",
              i + 1 < current
                ? "bg-[--gold] text-white"
                : i + 1 === current
                ? "bg-[--navy] text-white ring-2 ring-[--gold] ring-offset-2"
                : "bg-[rgba(15,23,42,.07)] text-[#7a8aa0]",
            ].join(" ")}
          >
            {i + 1 < current ? (
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span
            className={[
              "text-[12px] font-semibold tracking-wide hidden sm:block",
              i + 1 === current ? "text-[--navy]" : "text-[#a0aec0]",
            ].join(" ")}
          >
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={[
                "w-8 h-px transition-all duration-300",
                i + 1 < current ? "bg-[--gold]" : "bg-[rgba(15,23,42,.1)]",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Step 1 ──────────────────────────────────────────────── */
function Step1Form({ onNext }: { onNext: (d: Step1) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1>({ resolver: zodResolver(step1Schema) });
  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom de l'entreprise *" error={errors.companyName?.message}>
          <Input register={register("companyName")} error={errors.companyName?.message} placeholder="Ex : SATBCI Construction" />
        </Field>
        <Field label="Numéro d'enregistrement *" error={errors.registrationNumber?.message}>
          <Input register={register("registrationNumber")} error={errors.registrationNumber?.message} placeholder="Ex : CI-ABJ-2020-B12345" />
        </Field>
        <Field label="Numéro d'identification fiscale *" error={errors.taxId?.message}>
          <Input register={register("taxId")} error={errors.taxId?.message} placeholder="NIF / Matricule fiscal" />
        </Field>
        <Field label="Secteur d'activité *" error={errors.sector?.message}>
          <Select register={register("sector")} error={errors.sector?.message} options={SECTORS} placeholder="Sélectionner un secteur" />
        </Field>
      </div>
      <Field label="Date de création *" error={errors.foundingDate?.message}>
        <Input register={register("foundingDate")} error={errors.foundingDate?.message} type="date" className="max-w-[260px]" />
      </Field>
      <div className="flex items-center justify-between pt-2">
        <div />
        <button type="submit" className="btn-gold">
          <span>Suivant</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}

/* ─── Step 2 ──────────────────────────────────────────────── */
function Step2Form({ onNext, onBack }: { onNext: (d: Step2) => void; onBack: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2>({ resolver: zodResolver(step2Schema) });
  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email de l'entreprise *" error={errors.companyEmail?.message}>
          <Input register={register("companyEmail")} error={errors.companyEmail?.message} placeholder="contact@entreprise.com" type="email" />
        </Field>
        <Field label="Numéro de téléphone *" error={errors.phone?.message}>
          <Input register={register("phone")} error={errors.phone?.message} placeholder="+225 07 00 00 00" type="tel" />
        </Field>
        <Field label="Site web" error={errors.website?.message}>
          <Input register={register("website")} error={errors.website?.message} placeholder="https://www.entreprise.com" type="url" />
        </Field>
        <Field label="Adresse *" error={errors.address?.message}>
          <Input register={register("address")} error={errors.address?.message} placeholder="Rue, Quartier" />
        </Field>
        <Field label="Ville *" error={errors.city?.message}>
          <Input register={register("city")} error={errors.city?.message} placeholder="Abidjan" />
        </Field>
        <Field label="Pays *" error={errors.country?.message}>
          <Input register={register("country")} error={errors.country?.message} placeholder="Côte d'Ivoire" defaultValue="Côte d'Ivoire" />
        </Field>
      </div>
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-5 py-3 text-[13px] font-bold tracking-wider uppercase text-[#7a8aa0] border border-[rgba(10,22,40,.1)] bg-transparent cursor-pointer transition-all duration-200 hover:border-[--navy] hover:text-[--navy]">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Précédent</span>
        </button>
        <button type="submit" className="btn-gold">
          <span>Suivant</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}

/* ─── Step 3 ──────────────────────────────────────────────── */
function Step3Form({ onSubmit, onBack, loading }: { onSubmit: (d: Step3) => void; onBack: () => void; loading: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3>({ resolver: zodResolver(step3Schema) });
  const [showPwd, setShowPwd] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom complet du dirigeant *" error={errors.ceoName?.message}>
          <Input register={register("ceoName")} error={errors.ceoName?.message} placeholder="Prénom NOM" />
        </Field>
        <Field label="Email du dirigeant *" error={errors.ceoEmail?.message}>
          <Input register={register("ceoEmail")} error={errors.ceoEmail?.message} placeholder="dirigeant@entreprise.com" type="email" />
        </Field>
        <Field label="Téléphone du dirigeant *" error={errors.ceoPhone?.message}>
          <Input register={register("ceoPhone")} error={errors.ceoPhone?.message} placeholder="+225 07 00 00 00" type="tel" />
        </Field>
        <Field label="Mot de passe *" error={errors.password?.message}>
          <div className="relative">
            <Input register={register("password")} error={errors.password?.message} placeholder="Minimum 8 caractères" type={showPwd ? "text" : "password"} />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-[--navy] transition-colors"
            >
              {showPwd ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </Field>
        <Field label="Confirmer le mot de passe *" error={errors.confirmPassword?.message}>
          <Input register={register("confirmPassword")} error={errors.confirmPassword?.message} placeholder="Répéter le mot de passe" type={showPwd ? "text" : "password"} />
        </Field>
      </div>
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-5 py-3 text-[13px] font-bold tracking-wider uppercase text-[#7a8aa0] border border-[rgba(10,22,40,.1)] bg-transparent cursor-pointer transition-all duration-200 hover:border-[--navy] hover:text-[--navy]">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Précédent</span>
        </button>
        <button type="submit" className="btn-gold" disabled={loading}>
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Validation...</span>
            </>
          ) : (
            <>
              <span>Valider l&apos;inscription</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ─── Success screen ──────────────────────────────────────── */
function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-6">
      <div className="w-20 h-20 rounded-full bg-[color:var(--gold-pale)] border-2 border-[--gold] flex items-center justify-center">
        <svg width="36" height="36" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h3 className="font-['Cormorant_Garamond'] text-[32px] font-semibold text-[--navy] mb-3">
          Demande soumise avec succès
        </h3>
        <p className="text-[15px] text-[#718096] leading-relaxed max-w-[420px] text-justify">
          Votre dossier d&apos;adhésion à UNIE-BTP a été reçu. Notre équipe 
          vous contactera dans un délai de 48 heures ouvrables pour 
          finaliser votre intégration.
        </p>
      </div>
      <div className="flex flex-col gap-2 text-[13px] text-[#a0aec0]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[--gold]" />
          <span>Vérification de votre dossier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[--gold]" />
          <span>Confirmation par email sous 48h</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[--gold]" />
          <span>Accès à votre espace membre</span>
        </div>
      </div>
      <button onClick={onClose} className="btn-gold mt-2">
        <span>Fermer</span>
      </button>
    </div>
  );
}

/* ─── Main Modal ──────────────────────────────────────────── */
interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RegisterModal({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<Step1 & Step2 & Step3>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setData({});
      setDone(false);
    }, 300);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onStep1 = (d: Step1) => {
    setData((p) => ({ ...p, ...d }));
    setStep(2);
  };
  const onStep2 = (d: Step2) => {
    setData((p) => ({ ...p, ...d }));
    setStep(3);
  };
  const onStep3 = async (d: Step3) => {
    setData((p) => ({ ...p, ...d }));
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ animation: "fadeIn .2s ease" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(5,10,20,.7)] backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-[680px] bg-white rounded-[3px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ animation: "fadeUp .35s ease" }}
      >
        {/* Gold top border */}
        <div className="h-[3px] bg-gradient-to-r from-[--gold] to-[--gold-light]" />

        <div className="px-10 py-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-[#a0aec0] hover:text-[--navy] hover:bg-[rgba(15,23,42,.06)] transition-all"
            aria-label="Fermer"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {!done ? (
            <>
              {/* Header */}
              <div className="mb-7">
                <p className="text-[11px] font-bold tracking-[.2em] uppercase text-[--gold] mb-2">
                  Adhésion UNIE-BTP
                </p>
                <h2 className="font-['Cormorant_Garamond'] text-[32px] font-semibold text-[--navy] leading-tight mb-5">
                  Enregistrez votre entreprise
                </h2>
                <ProgressBar step={step} />
                <div className="mt-4">
                  <StepDots current={step} />
                </div>
              </div>

              {/* Step subtitle */}
              <div className="mb-6 pb-5 border-b border-[rgba(15,23,42,.06)]">
                <h3 className="text-[15px] font-bold text-[--navy] tracking-wide">
                  {STEPS[step - 1].sub}
                </h3>
              </div>

              {/* Forms */}
              {step === 1 && <Step1Form onNext={onStep1} />}
              {step === 2 && <Step2Form onNext={onStep2} onBack={() => setStep(1)} />}
              {step === 3 && <Step3Form onSubmit={onStep3} onBack={() => setStep(2)} loading={loading} />}

              {/* Already member */}
              <p className="text-center text-[13px] font-semibold text-[--navy] mt-6 pt-5 border-t border-[rgba(15,23,42,.05)]">
                <span className="text-[#a0aec0] font-normal">Vous avez déjà un compte ? </span>
                <a href="#" className="text-[--gold] hover:underline">
                  Connectez-vous
                </a>
              </p>
            </>
          ) : (
            <SuccessScreen onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}
