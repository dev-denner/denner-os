"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScheduleButtons from "@/components/ScheduleButtons";
import CompleteButton from "@/components/CompleteButton";
import { CheckSquare, CalendarDays } from "lucide-react";

type Area = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
};

type Task = {
  id: string;
  title: string;
  areaId: string;
  area: Area;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "TODO" | "DOING" | "DONE";
  dueDate?: Date | string | null;
};

export default function OverduePanelClient({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleAll() {
    if (selected.length === tasks.length) {
      setSelected([]);
      return;
    }

    setSelected(tasks.map((task) => task.id));
  }

  async function completeSelected() {
    await Promise.all(
      selected.map((id) =>
        fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "DONE" }),
        })
      )
    );

    setSelected([]);
    router.refresh();
  }

  async function scheduleSelected(daysToAdd: number) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(12, 0, 0, 0);

    await Promise.all(
      selected.map((id) =>
        fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dueDate: date.toISOString(),
          }),
        })
      )
    );

    setSelected([]);
    router.refresh();
  }

  return (
    <section className="rounded-2xl bg-red-950/30 border border-red-500/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-red-200">🚨 Vencidas</h2>
          <p className="text-sm text-red-200/80">
            {tasks.length} tarefa(s) precisam de atenção.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={toggleAll}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-medium"
          >
            {selected.length === tasks.length
              ? "Limpar seleção"
              : "Selecionar todas"}
          </button>

          {selected.length > 0 && (
            <>
              <button
                onClick={() => scheduleSelected(0)}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-xl text-sm font-medium"
              >
                <CalendarDays size={16} />
                Hoje ({selected.length})
              </button>

              <button
                onClick={() => scheduleSelected(1)}
                className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-sm font-medium"
              >
                <CalendarDays size={16} />
                Amanhã
              </button>

              <button
                onClick={completeSelected}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl text-sm font-medium"
              >
                <CheckSquare size={16} />
                Concluir
              </button>
            </>
          )}

          <a
            href="/?period=OVERDUE"
            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-medium"
          >
            Ver todas
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-5">
        {tasks.slice(0, 6).map((task) => {
          const checked = selected.includes(task.id);

          return (
            <div
              key={task.id}
              className={`rounded-xl border p-4 ${
                checked
                  ? "bg-red-900/50 border-red-300"
                  : "bg-zinc-950/70 border-red-500/40"
              }`}
            >
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(task.id)}
                  className="mt-1"
                />

                <div className="flex-1">
                  <a
                    href={`/tasks/${task.id}/edit`}
                    className="font-semibold hover:underline"
                  >
                    {task.title}
                  </a>

                  <p className="text-xs text-red-200/80 mt-2">
                    {task.area.icon} {task.area.name} ·{" "}
                    {task.dueDate &&
                      new Date(task.dueDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </label>

              <ScheduleButtons taskId={task.id} />

              <div className="flex justify-end mt-2">
                <CompleteButton taskId={task.id} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}