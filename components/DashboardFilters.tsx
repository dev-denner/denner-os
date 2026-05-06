"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Area = {
  id: string;
  name: string;
  icon?: string | null;
};

export default function DashboardFilters({ areas }: { areas: Area[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "ALL" || value.trim() === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
        defaultValue={searchParams.get("areaId") ?? "ALL"}
        onChange={(e) => updateFilter("areaId", e.target.value)}
      >
        <option value="ALL">Todas as áreas</option>

        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.icon} {area.name}
          </option>
        ))}
      </select>

      <select
        className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
        defaultValue={searchParams.get("priority") ?? "ALL"}
        onChange={(e) => updateFilter("priority", e.target.value)}
      >
        <option value="ALL">Todas as prioridades</option>
        <option value="CRITICAL">Crítica</option>
        <option value="HIGH">Alta</option>
        <option value="MEDIUM">Média</option>
        <option value="LOW">Baixa</option>
      </select>

      <select
        className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
        defaultValue={searchParams.get("period") ?? "ALL"}
        onChange={(e) => updateFilter("period", e.target.value)}
      >
        <option value="ALL">Todos os períodos</option>
        <option value="OVERDUE">Vencidas</option>
        <option value="TODAY">Hoje</option>
        <option value="WEEK">Esta semana</option>
      </select>

      <input
        className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
        placeholder="Buscar tarefa..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => updateFilter("q", e.target.value)}
      />
    </div>
  );
}