"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function CreateTableButton({ baseId, nextTableNumber }: { baseId: string; nextTableNumber: number }) {
  const router = useRouter();

  const createTable = api.table.create.useMutation({
    onSuccess: () => {
      router.refresh(); // reload server components so new table appears
    },
  });

  return (
    <button
      onClick={() =>
        createTable.mutate({
          baseId,
          tableName: `Table ${nextTableNumber}`,
        })
      }
      disabled={createTable.isPending}
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
    >
      {createTable.isPending ? "Creating..." : "+ Create Table"}
    </button>
  );
}
