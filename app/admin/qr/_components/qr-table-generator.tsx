"use client";

import { useMemo, useState } from "react";
import { AdminButton, AdminField } from "@/app/admin/_components/admin-primitives";

type QrTableGeneratorProps = {
  initialBasePath: string;
};

type TableEntry = {
  table: number;
  url: string;
  qrSrc: string;
};

function clampTable(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(200, Math.max(1, Math.round(value)));
}

export function QrTableGenerator({ initialBasePath }: QrTableGeneratorProps) {
  const [startTable, setStartTable] = useState(1);
  const [endTable, setEndTable] = useState(12);

  const rows = useMemo<TableEntry[]>(() => {
    const start = clampTable(Math.min(startTable, endTable));
    const end = clampTable(Math.max(startTable, endTable));
    const out: TableEntry[] = [];

    for (let table = start; table <= end; table += 1) {
      const url = `${initialBasePath}?table=${table}`;
      out.push({
        table,
        url,
        qrSrc: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`,
      });
    }
    return out;
  }, [endTable, initialBasePath, startTable]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3 print:hidden">
        <AdminField label="Start table" htmlFor="start_table">
          <input
            id="start_table"
            name="start_table"
            type="number"
            value={startTable}
            min={1}
            max={200}
            onChange={(event) => setStartTable(Number(event.target.value))}
            required
            className="ui-input"
          />
        </AdminField>
        <AdminField label="End table" htmlFor="end_table">
          <input
            id="end_table"
            name="end_table"
            type="number"
            value={endTable}
            min={1}
            max={200}
            onChange={(event) => setEndTable(Number(event.target.value))}
            required
            className="ui-input"
          />
        </AdminField>
        <div className="flex items-end justify-start md:justify-end">
          <AdminButton type="button" onClick={() => window.print()}>
            Print sheet
          </AdminButton>
        </div>
      </div>

      <div className="print:mt-0">
        <p className="mb-3 text-sm text-secondary-ui print:hidden">
          Generating links for tables {rows[0]?.table ?? 0} to {rows[rows.length - 1]?.table ?? 0}.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
          {rows.map((entry) => (
            <article
              key={entry.table}
              className="rounded-2xl border border-default bg-surface p-3 text-center print:break-inside-avoid"
            >
              <h3 className="text-base font-semibold text-primary-ui">Table {entry.table}</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.qrSrc}
                alt={`QR code for table ${entry.table}`}
                className="mx-auto my-2 h-40 w-40 rounded-lg border border-default bg-white p-1"
              />
              <p className="break-all text-xs text-muted-ui">{entry.url}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
