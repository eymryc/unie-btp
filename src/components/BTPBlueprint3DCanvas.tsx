"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PerspectiveCamera } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function BlueprintScene({ intensity, quality }: { intensity: number; quality: "low" | "high" }) {
  const group = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.Group>(null);
  const spiral = useRef<THREE.Group>(null);
  const frames = useRef<THREE.Group>(null);

  const spiralPoints = useMemo(() => {
    // Rebar-like helix / spiral around a center axis.
    const turns = quality === "low" ? 3.25 : 4.5;
    const segments = quality === "low" ? 160 : 260;
    const radius = quality === "low" ? 5.2 : 6.2;
    const height = quality === "low" ? 3.2 : 4.0;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const ang = t * Math.PI * 2 * turns;
      const r = radius * (0.86 + 0.14 * Math.sin(t * Math.PI * 2));
      const y = (t - 0.5) * height;
      pts.push(new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r));
    }
    return pts;
  }, [quality]);

  const frameRects = useMemo(() => {
    // Minimal structural frames (like building section outlines).
    const out: Array<{ w: number; h: number; y: number; z: number }> = [];
    const count = quality === "low" ? 4 : 6;
    for (let i = 0; i < count; i++) {
      out.push({
        w: 8 + i * 1.4,
        h: 3.5 + i * 0.8,
        y: -1.4 + i * 0.55,
        z: -2.5 + i * 0.9,
      });
    }
    return out;
  }, [quality]);

  const arcPoints = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    const arcs = quality === "low" ? 2 : 3;
    for (let a = 0; a < arcs; a++) {
      const pts: THREE.Vector3[] = [];
      const r = 7.5 + a * 1.2;
      const y = -0.9 + a * 0.6;
      const steps = quality === "low" ? 64 : 96;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const ang = Math.PI * (0.12 + 0.76 * t);
        pts.push(new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r));
      }
      out.push(pts);
    }
    return out;
  }, [quality]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.10) * 0.10 * intensity;
    group.current.position.y = Math.sin(t * 0.22) * 0.14 * intensity;
    if (sweep.current) {
      sweep.current.position.x = Math.sin(t * 0.5) * 7.5;
      sweep.current.position.z = Math.cos(t * 0.42) * 5.5;
      sweep.current.rotation.y = t * 0.12;
    }
    if (spiral.current) {
      spiral.current.rotation.y = t * 0.10 * intensity;
      spiral.current.rotation.x = Math.sin(t * 0.12) * 0.08 * intensity;
    }
    if (frames.current) {
      frames.current.rotation.y = -t * 0.05 * intensity;
    }
  });

  return (
    <group ref={group}>
      {/* Rebar spiral */}
      <group ref={spiral}>
        <Line
          points={spiralPoints}
          color="rgba(237,97,32,0.36)"
          lineWidth={quality === "low" ? 1.4 : 1.8}
          transparent
          opacity={0.9}
        />
        {/* inner offset spiral (depth) */}
        <Line
          points={spiralPoints.map((p) => new THREE.Vector3(p.x * 0.86, p.y * 0.94, p.z * 0.86))}
          color="rgba(15,23,42,0.26)"
          lineWidth={quality === "low" ? 1.0 : 1.2}
          transparent
          opacity={0.85}
        />
      </group>

      {/* Structural frames */}
      <group ref={frames}>
        {frameRects.map((r, idx) => {
          const hw = r.w / 2;
          const hh = r.h / 2;
          const pts = [
            new THREE.Vector3(-hw, r.y - hh, r.z),
            new THREE.Vector3(hw, r.y - hh, r.z),
            new THREE.Vector3(hw, r.y + hh, r.z),
            new THREE.Vector3(-hw, r.y + hh, r.z),
            new THREE.Vector3(-hw, r.y - hh, r.z),
          ];
          return (
            <Line
              key={idx}
              points={pts}
              color="rgba(15,23,42,0.22)"
              lineWidth={quality === "low" ? 1.0 : 1.2}
              transparent
              opacity={0.9}
            />
          );
        })}
        {arcPoints.map((pts, idx) => (
          <Line
            key={`a-${idx}`}
            points={pts}
            color="rgba(237,97,32,0.18)"
            lineWidth={quality === "low" ? 1.0 : 1.2}
            transparent
            opacity={0.85}
          />
        ))}
      </group>

      {/* Soft sweep accents (elegant motion) */}
      <group ref={sweep}>
        <Line
          points={[new THREE.Vector3(-10, 0.25, 0), new THREE.Vector3(10, 0.25, 0)]}
          color="rgba(237,97,32,0.22)"
          lineWidth={quality === "low" ? 1.4 : 1.8}
          transparent
          opacity={0.9}
        />
        <Line
          points={[new THREE.Vector3(0, 0.28, -7), new THREE.Vector3(0, 0.28, 7)]}
          color="rgba(255,122,58,0.16)"
          lineWidth={quality === "low" ? 1.0 : 1.4}
          transparent
          opacity={0.85}
        />
      </group>

      {/* Framing outline */}
      <Line
        points={[
          new THREE.Vector3(-11, 0.02, -7),
          new THREE.Vector3(11, 0.02, -7),
          new THREE.Vector3(11, 0.02, 7),
          new THREE.Vector3(-11, 0.02, 7),
          new THREE.Vector3(-11, 0.02, -7),
        ]}
        color="rgba(15,23,42,0.22)"
        lineWidth={2.2}
        transparent
        opacity={0.9}
      />
    </group>
  );
}

export default function BTPBlueprint3DCanvas({
  dpr,
  intensity,
  quality,
}: {
  dpr: number;
  intensity: number;
  quality: "low" | "high";
}) {
  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: quality !== "low", alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["transparent"]} />
      <PerspectiveCamera makeDefault position={[0, 7.5, 14]} fov={40} />
      <ambientLight intensity={0.6} />
      <BlueprintScene intensity={intensity} quality={quality} />
    </Canvas>
  );
}

