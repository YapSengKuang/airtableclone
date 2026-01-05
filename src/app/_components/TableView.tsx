"use client";

import { useState } from "react";
import TableTabs from "./TableTabs";
import CreateTableButton from "./CreateTableButton";

export default function TableView({
  tables,
  baseId
}: {
    baseId: string;
    tables: {
        id: string;
        table_name: string;
        fields: any[];
        rows: any[];
        cells: any[];
    }[];
}) {
    const [activeId, setActiveId] = useState(tables[0]?.id);

    const activeTable = tables.find((t) => t.id === activeId);

    if (!activeTable) {
        return <p>No table selected.</p>;
    }

    // Extract normalized data
    const fields = activeTable.fields;
    const rows = activeTable.rows;
    const cells = activeTable.cells ?? []; // in case it's undefined

    const columns = fields.map(field => ({ 
        id: field.id, 
        header: field.name, 
        accessorFn: (row: Record<string, any>) => row[field.id], 
    }));

    const rowData = rows.map(
        row => { 
            const rowObj: Record<string, any> = { id: row.id }; 
            cells 
                .filter((c: any) => c.row_id === row.id) 
                .forEach((c: any) => { rowObj[c.field_id] = c.value; }); 
            return rowObj ; 
        }
    );
    console.log("Row Data:", rowData); // Debugging line
    console.log("Columns:", columns); // Debugging line 


    return (
        <div>
        <TableTabs tables={tables} onSelect={setActiveId} />
        <CreateTableButton baseId={baseId} nextTableNumber={tables.length + 1} />

        <div className="mt-6">
            {activeTable ? (
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                {activeTable.table_name}
                </h2>

                {/* Placeholder for now
                <pre className="text-sm bg-gray-50 p-4 rounded-lg">
                {JSON.stringify(activeTable, null, 2)}
                </pre> */}


            </div>
            ) : (
            <p>No table selected.</p>
            )}
        </div>
        </div>
    );
}
