"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Area = {
  id: string;
  name: string;
  icon?: string | null;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  areaId: string;
  area?: Area;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "TODO" | "DOING" | "DONE";
  dueDate?: Date | string | null;
  isRecurring?: boolean | null;
  recurrence?: "DAILY" | "WEEKLY" | "MONTHLY" | null;
};

export default function EditTaskForm({
  task,
  areas,
}: {
  task: Task;
  areas: Area[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState(task.title ?? "");
  const [description, setDescription] = useState(task.description ?? "");
  const [areaId, setAreaId] = useState(task.areaId ?? areas[0]?.id ?? "");
  const [priority, setPriority] = useState(task.priority ?? "MEDIUM");
  const [status, setStatus] = useState(task.status ?? "TODO");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
  );
  const [isRecurring, setIsRecurring] = useState(task.isRecurring ?? false);
  const [recurrence, setRecurrence] = useState<
    "DAILY" | "WEEKLY" | "MONTHLY"
  >(task.recurrence ?? "WEEKLY");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        areaId,
        priority,
        status,
        dueDate: dueDate || null,
        isRecurring,
        recurrence: isRecurring ? recurrence : null,
      }),
    });

    router.push("/");
    router.refresh();
  }

  async function handleDelete() {
    const ok = confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!ok) return;

    await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Editar tarefa</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />

          <textarea
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição / observações"
          />

          <select
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
          >
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.icon} {area.name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>

          <select
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
          >
            <option value="TODO">A fazer</option>
            <option value="DOING">Em execução</option>
            <option value="DONE">Feito</option>
          </select>

          <input
            type="date"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Tarefa recorrente
          </label>

          {isRecurring && (
            <select
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
              value={recurrence}
              onChange={(e) =>
                setRecurrence(e.target.value as "DAILY" | "WEEKLY" | "MONTHLY")
              }
            >
              <option value="DAILY">Diária</option>
              <option value="WEEKLY">Semanal</option>
              <option value="MONTHLY">Mensal</option>
            </select>
          )}

          <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded">
            Salvar alterações
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-700 hover:bg-red-600 p-3 rounded"
          >
            Excluir tarefa
          </button>
        </form>
      </div>
    </main>
  );
}