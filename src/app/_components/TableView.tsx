"use client";

import { useState, useMemo } from "react";
import TableTabs from "./TableTabs";
import CreateTableButton from "./CreateTableButton";
import DataGrid from "./DataGrid";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type Table = RouterOutputs["table"]["getByBaseId"][number];

export default function TableView({ baseId }: { baseId: string }) {
  const { data: tables } = api.table.getByBaseId.useQuery({ id: baseId });

  const utils = api.useContext();

  const updateCellMutation = api.cell.update.useMutation({
    onSuccess: () => {
      void utils.table.getByBaseId.invalidate({ id: baseId });
    },
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTable: Table | null =
    tables?.find((t) => t.id === (activeId ?? tables[0]?.id)) ?? null;

  const fields = activeTable?.fields ?? [];
  const rows = activeTable?.rows ?? [];
  const cells = activeTable?.cells ?? [];

  const columns = useMemo(() => {
  return fields.map((field) => ({
    id: field.id,
    header: field.name,
    accessorFn: (row: Record<string, unknown>) => row[field.id],
    meta: {
      type: field.type as "text" | "number",
      update: (
        cell: {
          row: { original: { __cellIds: Record<string, string | undefined> } };
        },
        value: unknown
      ) => {
        const cellId = cell.row.original.__cellIds[field.id];
        if (!cellId) return; // prevents undefined error

        updateCellMutation.mutate({
          cellId,
          value,
        });
      },
    },
  }));
}, [fields, updateCellMutation]);


  const rowData = useMemo(() => {
    return rows.map((row) => {
      const rowObj: Record<string, unknown> & {
        __cellIds: Record<string, string>;
      } = { id: row.id, __cellIds: {} };

      cells
        .filter((c) => c.row_id === row.id)
        .forEach((c) => {
          rowObj[c.field_id] = c.value;
          rowObj.__cellIds[c.field_id] = c.id;
        });

      return rowObj;
    });
  }, [rows, cells]);

  if (!tables) return <p>Loading...</p>;
  if (!activeTable) return <p>No table selected.</p>;

  return (
    <div>
      <TableTabs tables={tables} onSelect={setActiveId} />
      <CreateTableButton baseId={baseId} nextTableNumber={tables.length + 1} />

      <div className="mt-6">
        <div className="p-4 rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {activeTable.table_name}
          </h2>

          <DataGrid data={rowData} columns={columns} />
        </div>
      </div>
    </div>
  );
}
