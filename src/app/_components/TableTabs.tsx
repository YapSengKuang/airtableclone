"use client";

import { useState } from "react";
import CreateTableButton from "./CreateTableButton";


export default function TableTabs({
  tables,
  onSelect,
}: {
  tables: { id: string; table_name: string }[];
  onSelect?: (id: string) => void;
}) {
  const [active, setActive] = useState(tables[0]?.id);

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => handleSelect(table.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
            ${
              active === table.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }
          `}
        >
          {table.table_name}
        </button>
      ))}

      
    </div>
  );
}
