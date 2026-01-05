"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

function EditableCell({
  value: initialValue,
  onChange,
  type,
}: {
  value: any;
  onChange: (v: any) => void;
  type: "text" | "number";
}) {
  const [value, setValue] = React.useState(
    initialValue ?? ""
  );

  const handleBlur = () => {
    if (type === "number") {
      const num = Number(value);
      if (!isNaN(num)) {
        onChange(num);
      } else {
        onChange(null); // invalid number
      }
    } else {
      onChange(value);
    }
  };

  return (
    <input
      type={type === "number" ? "number" : "text"}
      className="w-full bg-transparent outline-none"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
}



export default function DataGrid({
    columns,
    data,
}: {
    columns: ColumnDef<any, any>[];
    data: any[];
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
        <div
            ref={parentRef}
            className="h-[500px] overflow-auto relative"
        >
            <div
            style={{
                height: totalSize,
                position: "relative",
            }}
            >
            {virtualRows.map((virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index];

                // Safety check
                if (!row) return null;
                return (
                <div
                    key={row.id}
                    className="flex absolute left-0 right-0"
                    style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    }}
                >
                    {row.getVisibleCells().map((cell) => (
                    <div
                        key={cell.id}
                        className="px-3 py-2 border-r min-w-[150px] hover:bg-gray-50"
                    >
                        <EditableCell
                            value={cell.getValue()}
                            onChange={(v) =>
                                (cell.column.columnDef.meta?.update ?? (() => {}))(cell, v)
                            }
                            type={cell.column.columnDef.meta?.type || "text"}
                        />



                    </div>
                    ))}
                </div>
                );
            })}
            </div>
        </div>
        </div>
    );
}
