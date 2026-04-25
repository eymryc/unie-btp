"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const BlueprintCanvas = dynamic(() => import("./BTPBlueprint3DCanvas"), { ssr: false });

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useMedia(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

export default function BTPBlueprint3D({
  opacity = 0.55,
  intensity = 1,
  className = "",
  hideBelow = 360,
}: {
  opacity?: number;
  intensity?: number;
  className?: string;
  hideBelow?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isSmall = useMedia(`(max-width: ${hideBelow}px)`);
  const isMobile = useMedia("(max-width: 768px)");

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const raw = window.devicePixelRatio || 1;
    return Math.min(isMobile ? 1.1 : 1.6, raw);
  }, [isMobile]);

  if (reducedMotion || isSmall) return null;

  const tunedOpacity = isMobile ? Math.min(opacity, 0.55) : opacity;
  const tunedIntensity = isMobile ? intensity * 0.8 : intensity;
  const quality: "low" | "high" = isMobile ? "low" : "high";

  return (
    <div
      aria-hidden="true"
      className={[
        "absolute inset-0 pointer-events-none",
        className,
      ].join(" ")}
      style={{
        opacity: tunedOpacity,
        // Premium look: keep it crisp (no strong glow).
        filter: "saturate(1.05) contrast(1.05)",
      }}
    >
      <BlueprintCanvas dpr={dpr} intensity={tunedIntensity} quality={quality} />
    </div>
  );
}

