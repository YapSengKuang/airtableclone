"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Cell,
} from "@tanstack/react-table";
import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

/** EditableCell — fully typed */
type EditableCellProps<TValue> = {
  value: TValue;
  onChange: (v: TValue) => void;
  type: "text" | "number";
};

function EditableCell<TValue>({
  value: initialValue,
  onChange,
  type,
}: EditableCellProps<TValue>) {
  const [value, setValue] = React.useState<TValue>(initialValue);

  const handleBlur = () => {
    if (type === "number") {
      const num = Number(value);
      onChange((isNaN(num) ? null : num) as TValue);
    } else {
      onChange(value);
    }
  };

  return (
    <input
      type={type === "number" ? "number" : "text"}
      className="w-full bg-transparent outline-none"
      value={String(value ?? "")}
      onChange={(e) => setValue(e.target.value as TValue)}
      onBlur={handleBlur}
    />
  );
}

/** DataGrid — fully generic, no any */
export default function DataGrid<TData>({
  columns,
  data,
}: {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex bg-gray-100 border-b">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex">
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="px-3 py-2 font-semibold border-r min-w-[150px]"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Body */}
      <div ref={parentRef} className="h-[500px] overflow-auto relative">
        <div style={{ height: totalSize, position: "relative" }}>
          {virtualRows.map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index];
            if (!row) return null;

            return (
              <div
                key={row.id}
                className="flex absolute left-0 right-0"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    | {
                        update?: (
                          cell: Cell<TData, unknown>,
                          value: unknown
                        ) => void;
                        type?: "text" | "number";
                      }
                    | undefined;

                  return (
                    <div
                      key={cell.id}
                      className="px-3 py-2 border-r min-w-[150px] hover:bg-gray-50"
                    >
                      <EditableCell
                        value={cell.getValue() as unknown}
                        onChange={(v) => {
                          const updateFn = meta?.update;
                          if (updateFn) updateFn(cell, v);
                        }}
                        type={meta?.type ?? "text"}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
