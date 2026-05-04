"use client";

import { useCallback, useMemo, useState } from "react";
import { AdminButton } from "@/app/admin/_components/admin-primitives";

type QrTableGeneratorProps = {
  initialMenuBaseUrl: string;
};

type TableEntry = {
  table: number;
  url: string;
  qrSrc: string;
};

type QrSelection =
  | { kind: "outside"; label: string; url: string }
  | { kind: "table"; label: string; table: number; url: string };

type QrTab = "takeaway" | "restaurant";

function clampTable(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(200, Math.max(1, Math.round(value)));
}

/** Accepts `yourdomain.com`, `https://host`, or full `/menu` URL. */
function normalizeMenuBase(input: string): string {
  let t = input.trim().replace(/\/$/, "");
  if (!t) return "";
  if (!/^https?:\/\//i.test(t)) {
    t = `https://${t}`;
  }
  if (!/\/menu$/i.test(t)) {
    t = `${t}/menu`;
  }
  return t;
}

function qrServiceUrl(menuUrl: string, size: number) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(menuUrl)}`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function downloadQrImage(filename: string, qrSrc: string) {
  try {
    const res = await fetch(qrSrc, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(qrSrc, "_blank", "noopener,noreferrer");
  }
}

function printQrContent(title: string, url: string, qrSrc: string) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=640,height=720");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, sans-serif; text-align: center; padding: 24px; margin: 0; }
  h1 { font-size: 1.125rem; font-weight: 600; margin: 0 0 16px; }
  img { max-width: 280px; height: auto; display: block; margin: 0 auto; }
  .url { word-break: break-all; font-size: 11px; margin-top: 16px; color: #444; max-width: 400px; margin-left: auto; margin-right: auto; }
</style></head><body>
<h1>${escapeHtml(title)}</h1>
<img src="${escapeHtml(qrSrc)}" alt="" />
<p class="url">${escapeHtml(url)}</p>
<script>
  window.addEventListener("load", function () {
    window.focus();
    window.print();
  });
</script>
</body></html>`);
  w.document.close();
}

export function QrTableGenerator({ initialMenuBaseUrl }: QrTableGeneratorProps) {
  const menuBase = useMemo(
    () => normalizeMenuBase(initialMenuBaseUrl.replace(/\/$/, "")),
    [initialMenuBaseUrl],
  );
  const hasMenuBase = menuBase.startsWith("http");

  const [startTable, setStartTable] = useState(1);
  const [endTable, setEndTable] = useState(12);
  const [activeTab, setActiveTab] = useState<QrTab>("restaurant");
  const [selection, setSelection] = useState<QrSelection | null>(null);

  const outsideEntry = useMemo(() => {
    if (!hasMenuBase) return null;
    const url = menuBase;
    return {
      label: "Takeaway",
      url,
      qrSrc: qrServiceUrl(url, 220),
    };
  }, [hasMenuBase, menuBase]);

  const rows = useMemo<TableEntry[]>(() => {
    if (!hasMenuBase) return [];
    const start = clampTable(Math.min(startTable, endTable));
    const end = clampTable(Math.max(startTable, endTable));
    const out: TableEntry[] = [];

    for (let table = start; table <= end; table += 1) {
      const url = `${menuBase}?table=${table}`;
      out.push({
        table,
        url,
        qrSrc: qrServiceUrl(url, 220),
      });
    }
    return out;
  }, [endTable, hasMenuBase, menuBase, startTable]);

  const closeModal = useCallback(() => setSelection(null), []);

  const modalQrSrc = selection ? qrServiceUrl(selection.url, 400) : "";

  return (
    <div className="space-y-2">
      <style>{`
        @media print {
          @page { margin: 12mm; }
          body * {
            visibility: hidden !important;
          }
          #qr-print-root,
          #qr-print-root * {
            visibility: visible !important;
          }
          #qr-print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="space-y-2 print:hidden">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <label
            htmlFor="menu_base_url"
            className="shrink-0 text-xs font-semibold text-primary-ui sm:min-w-36"
          >
            Public menu URL
          </label>
          <input
            id="menu_base_url"
            name="menu_base_url"
            type="text"
            value={hasMenuBase ? menuBase : ""}
            disabled
            placeholder="Not configured — set NEXT_PUBLIC_SITE_URL"
            className="ui-input min-h-0 flex-1 cursor-not-allowed py-1.5 text-sm opacity-80"
            readOnly
            aria-readonly="true"
          />
        </div>

        {!hasMenuBase ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
            Set <code className="rounded bg-amber-100/80 px-1">NEXT_PUBLIC_SITE_URL</code> to your public
            origin (e.g. <code className="rounded bg-amber-100/80 px-1">https://yourdomain.com</code>). QR links
            use <code className="rounded bg-amber-100/80 px-1">{'{origin}/menu'}</code>.
          </p>
        ) : null}

        <div
          className="flex w-full gap-0.5 rounded-lg border border-default bg-surface-soft p-0.5 print:hidden"
          role="tablist"
          aria-label="QR type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "takeaway"}
            id="qr-tab-takeaway"
            aria-controls="qr-panel-takeaway"
            onClick={() => setActiveTab("takeaway")}
            className={`min-h-8 flex-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
              activeTab === "takeaway"
                ? "bg-surface text-primary-ui shadow-sm"
                : "text-secondary-ui hover:text-primary-ui"
            }`}
          >
            Takeaway
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "restaurant"}
            id="qr-tab-restaurant"
            aria-controls="qr-panel-restaurant"
            onClick={() => setActiveTab("restaurant")}
            className={`min-h-8 flex-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
              activeTab === "restaurant"
                ? "bg-surface text-primary-ui shadow-sm"
                : "text-secondary-ui hover:text-primary-ui"
            }`}
          >
            In restaurant
          </button>
        </div>

        {activeTab === "takeaway" ? (
          <div className="space-y-2 print:hidden">
            <p className="text-xs text-secondary-ui leading-snug">
              No table number — link opens the menu for pickup, delivery, or ordering outside the venue.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <AdminButton
                type="button"
                className="px-3 py-1.5 text-xs"
                disabled={!hasMenuBase || !outsideEntry}
                onClick={() => window.print()}
              >
                Print sheet
              </AdminButton>
              <AdminButton
                type="button"
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                disabled={!hasMenuBase || !outsideEntry}
                onClick={() => {
                  if (!outsideEntry) return;
                  downloadQrImage(
                    "qr-takeaway.png",
                    qrServiceUrl(outsideEntry.url, 400),
                  );
                }}
              >
                Download
              </AdminButton>
            </div>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-3 print:hidden">
            <div className="flex flex-col gap-1">
              <label htmlFor="start_table" className="text-xs font-semibold text-primary-ui">
                Start table
              </label>
              <input
                id="start_table"
                name="start_table"
                type="number"
                value={startTable}
                min={1}
                max={200}
                disabled={!hasMenuBase}
                onChange={(event) => setStartTable(Number(event.target.value))}
                required
                className="ui-input min-h-0 py-1.5 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="end_table" className="text-xs font-semibold text-primary-ui">
                End table
              </label>
              <input
                id="end_table"
                name="end_table"
                type="number"
                value={endTable}
                min={1}
                max={200}
                disabled={!hasMenuBase}
                onChange={(event) => setEndTable(Number(event.target.value))}
                required
                className="ui-input min-h-0 py-1.5 text-sm"
              />
            </div>
            <div className="flex items-end justify-start md:justify-end">
              <AdminButton
                type="button"
                className="px-3 py-1.5 text-xs"
                disabled={!hasMenuBase || rows.length === 0}
                onClick={() => window.print()}
              >
                Print sheet
              </AdminButton>
            </div>
          </div>
        )}
      </div>

      <div id="qr-print-root" className="print:mt-0">
        {activeTab === "takeaway" ? (
          <section
            id="qr-panel-takeaway"
            role="tabpanel"
            aria-labelledby="qr-tab-takeaway"
            className="space-y-2"
          >
            {hasMenuBase && outsideEntry ? (
              <>
                <h3 className="text-center text-sm font-semibold text-primary-ui print:mb-2">
                  Takeaway
                </h3>
                <div className="mx-auto max-w-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setSelection({
                        kind: "outside",
                        label: outsideEntry.label,
                        url: outsideEntry.url,
                      })
                    }
                    className="w-full rounded-xl border border-default bg-surface p-2.5 text-center print:break-inside-avoid hover:bg-surface-soft cursor-pointer transition"
                  >
                    <h4 className="text-sm font-semibold text-primary-ui">{outsideEntry.label}</h4>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={outsideEntry.url}
                      src={outsideEntry.qrSrc}
                      alt="QR code for takeaway orders"
                      className="mx-auto my-2 h-40 w-40 rounded-lg border border-default bg-white p-1 pointer-events-none"
                    />
                    <p className="break-all text-xs text-muted-ui">{outsideEntry.url}</p>
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-secondary-ui print:hidden">
                Configure <code className="rounded border border-default bg-surface-soft px-1">NEXT_PUBLIC_SITE_URL</code>{" "}
                to show the takeaway QR.
              </p>
            )}
          </section>
        ) : null}

        {activeTab === "restaurant" ? (
          <section
            id="qr-panel-restaurant"
            role="tabpanel"
            aria-labelledby="qr-tab-restaurant"
            className="space-y-2"
          >
            <p className="text-xs text-secondary-ui leading-snug print:hidden">
              {hasMenuBase
                ? `Menu base: ${menuBase}. Tables ${rows[0]?.table ?? "—"}–${rows[rows.length - 1]?.table ?? "—"}.`
                : "Set NEXT_PUBLIC_SITE_URL to preview table QR codes."}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
              {rows.map((entry) => (
                <button
                  key={entry.table}
                  type="button"
                  onClick={() =>
                    setSelection({
                      kind: "table",
                      label: `Table ${entry.table}`,
                      table: entry.table,
                      url: entry.url,
                    })
                  }
                  className="rounded-xl border border-default bg-surface p-2.5 text-center print:break-inside-avoid hover:bg-surface-soft cursor-pointer transition"
                >
                  <h3 className="text-sm font-semibold text-primary-ui">Table {entry.table}</h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={entry.url}
                    src={entry.qrSrc}
                    alt={`QR code for table ${entry.table}`}
                    className="mx-auto my-2 h-40 w-40 rounded-lg border border-default bg-white p-1 pointer-events-none"
                  />
                  <p className="break-all text-xs text-muted-ui">{entry.url}</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {selection ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 print:hidden">
          <div
            className="w-full max-w-md rounded-2xl border border-default bg-surface p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="qr-modal-title" className="text-lg font-semibold text-primary-ui">
                  {selection.label}
                </h2>
                <p className="mt-1 break-all text-xs text-muted-ui">{selection.url}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-default text-secondary-ui hover:bg-surface-soft"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalQrSrc}
                alt=""
                className="h-52 w-52 rounded-xl border border-default bg-white p-2"
              />
              <div className="flex w-full flex-wrap justify-center gap-2">
                <AdminButton
                  type="button"
                  onClick={() =>
                    printQrContent(selection.label, selection.url, modalQrSrc)
                  }
                >
                  Print
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    downloadQrImage(
                      selection.kind === "table"
                        ? `qr-table-${selection.table}.png`
                        : "qr-takeaway.png",
                      modalQrSrc,
                    )
                  }
                >
                  Download
                </AdminButton>
                <AdminButton type="button" variant="secondary" onClick={closeModal}>
                  Close
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
