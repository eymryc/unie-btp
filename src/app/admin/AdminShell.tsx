"use client";

import Sidebar from "@/components/platform/Sidebar";

interface Props { role: string; children: React.ReactNode; }

export default function AdminShell({ role, children }: Props) {
  return (
    <div
      className="p-dark"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--p-bg)",
        fontFamily: "var(--p-font-ui)",
      }}
    >
      <Sidebar role={role} companyName="Administration UNIE BTP" />
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 32px",
          color: "var(--p-text)",
          backgroundImage: "linear-gradient(rgba(237,97,32,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(237,97,32,.025) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
