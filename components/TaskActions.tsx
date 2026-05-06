// components/TaskActions.tsx
"use client";

import { useRouter } from "next/navigation";

export default function TaskActions({ taskId }: { taskId: string }) {
  const router = useRouter();

  async function updateStatus(status: "TODO" | "DOING" | "DONE") {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    router.refresh();
  }

  return (
    <div className="mt-3 flex gap-2">
      <button onClick={() => updateStatus("TODO")} className="text-xs bg-zinc-700 px-2 py-1 rounded">
        A fazer
      </button>

      <button onClick={() => updateStatus("DOING")} className="text-xs bg-yellow-600 px-2 py-1 rounded">
        Em execução
      </button>

      <button onClick={() => updateStatus("DONE")} className="text-xs bg-green-600 px-2 py-1 rounded">
        Concluir
      </button>
    </div>
  );
}