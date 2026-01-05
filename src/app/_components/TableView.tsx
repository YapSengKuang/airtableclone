"use client";

import { useState } from "react";
import TableTabs from "./TableTabs";
import CreateTableButton from "./CreateTableButton";
import DataGrid from "./DataGrid";
import { api } from "~/trpc/react";
import React from "react";

export default function TableView({ baseId }: { baseId: string }) {
  const { data: tables } = api.table.getByBaseId.useQuery({ id: baseId });

  const utils = api.useContext();

  const updateCellMutation = api.cell.update.useMutation({
    onSuccess: () => {
      utils.table.getByBaseId.invalidate({ id: baseId });
    },
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  // Always compute these, even if tables is undefined
  const activeTable =
    tables?.find((t) => t.id === (activeId ?? tables?.[0]?.id)) ?? null;

  const fields = activeTable?.fields ?? [];
  const rows = activeTable?.rows ?? [];
  const cells = activeTable?.cells ?? [];

  const columns = React.useMemo(() => {
    return fields.map((field: any) => ({
      id: field.id,
      header: field.name,
      accessorFn: (row: Record<string, any>) => row[field.id],
      meta: {
        type: field.type,
        update: (cell: any, value: any) => {
          updateCellMutation.mutate({
            cellId: cell.row.original.__cellIds[field.id],
            value,
          });
        },
      },
    }));
  }, [fields]);

  const rowData = React.useMemo(() => {
    return rows.map((row: any) => {
      const rowObj: Record<string, any> = { id: row.id, __cellIds: {} };

      cells
        .filter((c: any) => c.row_id === row.id)
        .forEach((c: any) => {
          rowObj[c.field_id] = c.value;
          rowObj.__cellIds[c.field_id] = c.id;
        });

      return rowObj;
    });
  }, [rows, cells]);

  // Render AFTER all hooks
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
