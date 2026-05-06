"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Area = {
  id: string;
  name: string;
  icon?: string | null;
};

export default function NewTaskForm({ areas }: { areas: Area[] }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [areaId, setAreaId] = useState(areas[0]?.id ?? "");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<"DAILY" | "WEEKLY" | "MONTHLY">(
    "WEEKLY"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!areaId) {
      alert("Cadastre uma área antes de criar tarefas.");
      return;
    }

    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        areaId,
        priority,
        dueDate: dueDate || null,
        isRecurring,
        recurrence: isRecurring ? recurrence : null,
      }),
    });

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Nova tarefa</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Título"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Descrição / observações"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
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
            Criar tarefa
          </button>
        </form>
      </div>
    </main>
  );
}