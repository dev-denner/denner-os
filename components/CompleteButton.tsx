"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompleteButton({ taskId }: { taskId: string }) {
  const router = useRouter();

  async function complete() {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DONE" }),
    });

    router.refresh();
  }

  return (
    <button
      onClick={complete}
      className="flex items-center gap-1 text-xs bg-green-700 hover:bg-green-600 px-2 py-1 rounded"
    >
      <CheckCircle size={14} />
      Concluir
    </button>
  );
}