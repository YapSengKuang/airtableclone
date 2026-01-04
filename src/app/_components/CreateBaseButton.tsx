"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function CreateBaseButton() {
  const router = useRouter();

  const createBase = api.base.create.useMutation({
    onSuccess: () => {
      router.refresh(); // refresh server components so the new base appears
    },
  });

  return (
    <button
      onClick={() => createBase.mutate({ base_name: "Untitled Base" })}
      disabled={createBase.isPending}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
    >
      {createBase.isPending ? "Creating..." : "+ Create Base"}
    </button>
  );
}
