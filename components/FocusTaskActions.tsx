"use client";

import { CheckCircle, ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FocusTaskActions({ taskId }: { taskId: string }) {
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
    <div className="flex flex-wrap gap-2 mt-5">
      <button
        onClick={() => updateStatus("DOING")}
        className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-xl text-sm font-medium"
      >
        <PlayCircle size={16} />
        Estou fazendo
      </button>

      <button
        onClick={() => updateStatus("DONE")}
        className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl text-sm font-medium"
      >
        <CheckCircle size={16} />
        Concluir e ir para próxima
      </button>

      <Link
        href="/"
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
    </div>
  );
}