"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, LayoutGrid, Rows3, Search } from "lucide-react";
import { usePref } from "@/lib/ui/prefs";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Makes the column sortable. */
  sortValue?: (row: T) => number | string;
  align?: "left" | "right" | "center";
  /** Hide in table view below a breakpoint (card view always shows it unless `card: false`). */
  hideBelow?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Show in card view. Defaults to true. */
  card?: boolean;
}

export interface FilterChip<T> {
  key: string;
  label: string;
  test: (row: T) => boolean;
}

const HIDE: Record<NonNullable<Column<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
  "2xl": "hidden 2xl:table-cell",
};

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" };

/**
 * Table with horizontal scrolling, a sticky first column, click-to-sort headers,
 * search, filter chips and a card view. View, sort and filter are saved per `id`.
 *
 * The first column is the "title" in card view.
 */
export function DataTable<T>({
  id,
  rows,
  rowKey,
  columns,
  onRowClick,
  search,
  searchPlaceholder = "Filter…",
  filters = [],
  defaultSort,
  stickyFirst = true,
  rowClassName,
  empty = "Nothing to show",
  toolbarExtra,
  defaultView = "table",
}: {
  /** Unique id; used to remember view, sort and filter. */
  id: string;
  rows: T[];
  rowKey: (row: T) => string;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  /** Text to match against the search box. Omit to hide the search box. */
  search?: (row: T) => string;
  searchPlaceholder?: string;
  filters?: FilterChip<T>[];
  defaultSort?: { key: string; dir: "asc" | "desc" };
  stickyFirst?: boolean;
  rowClassName?: (row: T) => string;
  empty?: React.ReactNode;
  toolbarExtra?: React.ReactNode;
  defaultView?: "table" | "cards";
}) {
  const [view, setView] = usePref<"table" | "cards">(`table.${id}.view`, defaultView);
  const [sort, setSort] = usePref<{ key: string; dir: "asc" | "desc" } | null>(`table.${id}.sort`, defaultSort ?? null);
  const [filterKey, setFilterKey] = usePref<string>(`table.${id}.filter`, "all");
  const [query, setQuery] = useState("");

  const sortable = columns.filter((c) => c.sortValue);
  const activeFilter = filters.find((f) => f.key === filterKey);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => (!activeFilter || activeFilter.test(r)) && (!q || !search || search(r).toLowerCase().includes(q)));
    const col = sort && columns.find((c) => c.key === sort.key && c.sortValue);
    if (col && sort) {
      const dir = sort.dir === "asc" ? 1 : -1;
      out = [...out].sort((a, b) => {
        const x = col.sortValue!(a);
        const y = col.sortValue!(b);
        return (typeof x === "string" ? x.localeCompare(String(y)) : x - (y as number)) * dir;
      });
    }
    return out;
  }, [rows, query, search, activeFilter, sort, columns]);

  function toggleSort(key: string) {
    setSort((s) => (s?.key !== key ? { key, dir: "desc" } : s.dir === "desc" ? { key, dir: "asc" } : null));
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        {search && (
          <label className="flex min-w-40 flex-1 items-center gap-2 rounded-xl bg-surface-2 px-3 py-1.5 sm:max-w-64">
            <Search size={14} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </label>
        )}
        {filters.length > 0 && (
          <div className="scrollbar-none flex max-w-full gap-1 overflow-x-auto">
            {[{ key: "all", label: "All" }, ...filters].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterKey(f.key)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${filterKey === f.key ? "bg-fg text-bg" : "bg-surface-2 text-muted hover:text-fg"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
        {toolbarExtra}
        <div className="ml-auto flex items-center gap-2">
          {sortable.length > 0 && (
            <label className="flex items-center gap-1.5 rounded-xl bg-surface-2 px-2.5 py-1.5 text-xs font-semibold text-muted">
              <ArrowUpDown size={13} />
              <select
                value={sort ? `${sort.key}:${sort.dir}` : ""}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(":");
                  setSort(key ? { key, dir: dir as "asc" | "desc" } : null);
                }}
                className="bg-transparent text-fg outline-none"
                aria-label="Sort by"
              >
                <option value="">Default order</option>
                {sortable.flatMap((c) => [
                  <option key={`${c.key}:desc`} value={`${c.key}:desc`}>
                    {c.header || c.key} ↓
                  </option>,
                  <option key={`${c.key}:asc`} value={`${c.key}:asc`}>
                    {c.header || c.key} ↑
                  </option>,
                ])}
              </select>
            </label>
          )}
          <div className="flex rounded-xl bg-surface-2 p-0.5" role="group" aria-label="View">
            {(["table", "cards"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`grid size-7 place-items-center rounded-lg ${view === v ? "bg-line text-fg" : "text-muted hover:text-fg"}`}
                aria-label={v === "table" ? "Table view" : "Card view"}
                aria-pressed={view === v}
                title={v === "table" ? "Table view" : "Card view"}
              >
                {v === "table" ? <Rows3 size={15} /> : <LayoutGrid size={15} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted">{empty}</div>
      ) : view === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="text-xs text-muted">
                {columns.map((c, i) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 font-medium whitespace-nowrap ${ALIGN[c.align ?? "left"]} ${c.hideBelow ? HIDE[c.hideBelow] : ""} ${
                      i === 0 && stickyFirst ? "sticky left-0 z-10 bg-surface" : ""
                    }`}
                  >
                    {c.sortValue ? (
                      <button onClick={() => toggleSort(c.key)} className={`inline-flex items-center gap-1 hover:text-fg ${sort?.key === c.key ? "text-fg" : ""}`}>
                        {c.header}
                        {sort?.key === c.key ? sort.dir === "desc" ? <ArrowDown size={12} /> : <ArrowUp size={12} /> : <ArrowUpDown size={11} className="opacity-40" />}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr
                  key={rowKey(r)}
                  onClick={onRowClick ? () => onRowClick(r) : undefined}
                  className={`group tabular border-t border-line whitespace-nowrap transition ${onRowClick ? "cursor-pointer hover:bg-surface-2" : ""} ${rowClassName?.(r) ?? ""}`}
                >
                  {columns.map((c, i) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 ${ALIGN[c.align ?? "left"]} ${c.hideBelow ? HIDE[c.hideBelow] : ""} ${
                        i === 0 && stickyFirst ? "sticky left-0 z-10 bg-surface transition group-hover:bg-surface-2" : ""
                      }`}
                    >
                      {c.render(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 p-3 sm:grid-cols-2 2xl:grid-cols-3">
          {shown.map((r) => {
            const [title, ...rest] = columns.filter((c) => c.card !== false);
            return (
              <div
                key={rowKey(r)}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={`rounded-2xl border border-line bg-surface-2/40 p-4 transition ${onRowClick ? "cursor-pointer hover:-translate-y-0.5 hover:bg-surface-2" : ""} ${rowClassName?.(r) ?? ""}`}
              >
                <div className="mb-3">{title.render(r)}</div>
                <dl className="tabular grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {rest.map((c) => (
                    <div key={c.key} className="min-w-0">
                      <dt className="text-[11px] text-muted">{c.header}</dt>
                      <dd className="truncate font-semibold">{c.render(r)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      )}
      <p className="border-t border-line px-4 py-2 text-[11px] text-muted">
        {shown.length} of {rows.length} · scroll sideways for more columns
      </p>
    </div>
  );
}
