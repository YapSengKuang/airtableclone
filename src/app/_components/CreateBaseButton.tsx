"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function CreateBaseButton() {
  const [open, setOpen] = useState(false);
  const [baseName, setBaseName] = useState("");

  const router = useRouter();

  const createBase = api.base.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      setBaseName("");
      router.refresh(); // refresh server components
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        + Create Base
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Create a new base</h2>

            <input
              type="text"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              placeholder="Base name"
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => createBase.mutate({ base_name: baseName })}
                disabled={createBase.isPending || baseName.trim().length === 0}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createBase.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
