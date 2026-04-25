"use client";

import { useState, useMemo } from "react";

export interface Column<T> {
  key: string;
  header: string;
  width?: string | number;
  render: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  /** Clés plates à chercher. Pour les champs imbriqués, utiliser searchFn. */
  searchKeys?: (keyof T)[];
  /** Fonction de recherche personnalisée. Prioritaire sur searchKeys. */
  searchFn?: (row: T, query: string) => boolean;
  pageSize?: number;
  emptyMessage?: string;
  getRowKey: (row: T) => string;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  searchPlaceholder = "Rechercher…",
  searchKeys = [],
  searchFn,
  pageSize: defaultPageSize = 10,
  emptyMessage = "Aucune donnée disponible",
  getRowKey,
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    if (searchFn) return data.filter((row) => searchFn(row, q));
    if (searchKeys.length === 0) return data;
    return data.filter((row) =>
      searchKeys.some((k) => {
        const val = row[k];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys, searchFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  const thStyle: React.CSSProperties = {
    padding: "10px 16px",
    fontSize: 10,
    fontWeight: 600,
    fontFamily: "var(--p-font-ui)",
    textTransform: "uppercase",
    letterSpacing: ".1em",
    color: "var(--p-muted)",
    background: "var(--p-surface2)",
    borderBottom: "0.5px solid var(--p-border2)",
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ background: "var(--p-surface)", border: "0.5px solid var(--p-border2)", borderRadius: 10, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "0.5px solid var(--p-border)", gap: 10, flexWrap: "wrap", background: "var(--p-surface)" }}>
        {/* Search */}
        <div style={{ position: "relative", minWidth: 220 }}>
          <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--p-dim)", pointerEvents: "none" }}>
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: "100%",
              paddingLeft: 28,
              paddingRight: 10,
              paddingTop: 7,
              paddingBottom: 7,
              background: "var(--p-surface2)",
              border: "0.5px solid var(--p-border)",
              borderRadius: 6,
              fontSize: 12,
              color: "var(--p-text)",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--p-gold)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--p-border)")}
          />
          {search && (
            <button
              onClick={() => handleSearch("")}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--p-dim)", cursor: "pointer", fontSize: 13, lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Right side: count + page size */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--p-dim)" }}>
            {loading ? "Chargement…" : `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            style={{ padding: "5px 8px", background: "var(--p-surface2)", border: "0.5px solid var(--p-border)", borderRadius: 5, fontSize: 11, color: "var(--p-muted)", cursor: "pointer" }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ ...thStyle, width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              /* Skeleton rows — largeurs fixes pour éviter l'hydration mismatch */
              Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col, colIdx) => {
                    const WIDTHS = [65, 80, 55, 75, 60, 70, 50, 85];
                    const w = WIDTHS[(rowIdx * columns.length + colIdx) % WIDTHS.length];
                    return (
                      <td key={col.key} style={{ padding: "12px 14px", borderBottom: "0.5px solid var(--p-border)" }}>
                        <div style={{ height: 12, borderRadius: 4, background: "var(--p-surface2)", animation: "pulse 1.5s ease-in-out infinite", width: `${w}%` }} />
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8, opacity: .3 }}>⊘</div>
                  <div style={{ fontSize: 13, color: "var(--p-muted)", fontWeight: 500, marginBottom: 4 }}>
                    {search ? `Aucun résultat pour « ${search} »` : emptyMessage}
                  </div>
                  {search && (
                    <button
                      onClick={() => handleSearch("")}
                      style={{ marginTop: 10, fontSize: 12, color: "var(--p-gold)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Effacer la recherche
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={getRowKey(row)}
                  style={{ transition: "background .1s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.015)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "12px 14px",
                        fontSize: 12,
                        color: "var(--p-text)",
                        borderBottom: i < paginated.length - 1 ? "0.5px solid var(--p-border)" : "none",
                        verticalAlign: "middle",
                      }}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "0.5px solid var(--p-border)" }}>
          <span style={{ fontSize: 11, color: "var(--p-dim)" }}>
            {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} sur {filtered.length}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <PagBtn onClick={() => setPage(1)} disabled={safePage === 1} label="«" />
            <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} label="‹" />

            {getPaginationRange(safePage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} style={{ padding: "4px 6px", fontSize: 12, color: "var(--p-dim)" }}>…</span>
              ) : (
                <PagBtn
                  key={p}
                  onClick={() => setPage(p as number)}
                  active={p === safePage}
                  label={String(p)}
                />
              )
            )}

            <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} label="›" />
            <PagBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages} label="»" />
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: .4; }
          50% { opacity: .15; }
        }
      `}</style>
    </div>
  );
}

function PagBtn({ onClick, disabled, active, label }: { onClick: () => void; disabled?: boolean; active?: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 28,
        height: 28,
        padding: "0 6px",
        fontSize: 12,
        borderRadius: 5,
        border: "0.5px solid",
        cursor: disabled ? "not-allowed" : "pointer",
        background: active ? "rgba(237,97,32,.15)" : "transparent",
        borderColor: active ? "rgba(237,97,32,.4)" : "var(--p-border)",
        color: active ? "var(--p-gold)" : disabled ? "var(--p-dim)" : "var(--p-muted)",
        fontWeight: active ? 600 : 400,
        transition: "all .1s",
      }}
    >
      {label}
    </button>
  );
}

function getPaginationRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}
