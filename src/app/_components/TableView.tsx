"use client";

import { useState } from "react";
import TableTabs from "./TableTabs";

export default function TableView({
  tables,
}: {
  tables: {
    id: string;
    table_name: string;
    fields: any[];
    rows: any[];
  }[];
}) {
  const [activeId, setActiveId] = useState(tables[0]?.id);

  const activeTable = tables.find((t) => t.id === activeId);

  return (
    <div>
      <TableTabs tables={tables} onSelect={setActiveId} />

      <div className="mt-6">
        {activeTable ? (
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              {activeTable.table_name}
            </h2>

            {/* Placeholder for now */}
            <pre className="text-sm bg-gray-50 p-4 rounded-lg">
              {JSON.stringify(activeTable, null, 2)}
            </pre>
          </div>
        ) : (
          <p>No table selected.</p>
        )}
      </div>
    </div>
  );
}
