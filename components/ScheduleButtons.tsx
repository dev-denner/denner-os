"use client";

import { CalendarCheck, CalendarPlus, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScheduleButtons({ taskId }: { taskId: string }) {
  const router = useRouter();

  async function schedule(daysToAdd: number) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(12, 0, 0, 0);

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dueDate: date.toISOString(),
      }),
    });

    router.refresh();
  }

  return (
    <div className="flex flex-wrap justify-end gap-2 mt-4">
      <button
        onClick={() => schedule(0)}
        className="flex items-center gap-1 text-xs bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded"
      >
        <CalendarCheck size={14} />
        Hoje
      </button>

      <button
        onClick={() => schedule(1)}
        className="flex items-center gap-1 text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded"
      >
        <CalendarPlus size={14} />
        Amanhã
      </button>

      <button
        onClick={() => schedule(7)}
        className="flex items-center gap-1 text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded"
      >
        <CalendarDays size={14} />
        Próxima semana
      </button>
    </div>
  );
}