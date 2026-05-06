"use client";

import { Pencil, Trash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Area = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  _count?: {
    tasks: number;
  };
};

export default function AreasManager({ areas }: { areas: Area[] }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function createArea(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    await fetch("/api/areas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, icon, color }),
    });

    setName("");
    setIcon("");
    setColor("");
    router.refresh();
  }

  async function updateArea(area: Area) {
    setError("");

    await fetch(`/api/areas/${area.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: area.name,
        icon: area.icon,
        color: area.color,
      }),
    });

    setEditingId(null);
    router.refresh();
  }

  async function deleteArea(id: string) {
    const ok = confirm("Excluir esta área?");
    if (!ok) return;

    setError("");

    const response = await fetch(`/api/areas/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Erro ao excluir área.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={createArea}
        className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-3"
      >
        <h2 className="font-bold text-xl">Nova área</h2>

        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
          placeholder="Nome. Ex: Saúde"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
          placeholder="Ícone. Ex: 🏃"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />

        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
          placeholder="Cor. Ex: blue, green, purple"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl">
          <Plus size={16} />
          Criar área
        </button>
      </form>

      {error && (
        <div className="rounded-xl bg-red-950/40 border border-red-500/60 p-4 text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {areas.map((area) => {
          const isEditing = editingId === area.id;

          return (
            <div
              key={area.id}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4"
            >
              {isEditing ? (
                <AreaEditRow
                  area={area}
                  onCancel={() => setEditingId(null)}
                  onSave={updateArea}
                />
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">
                      {area.icon} {area.name}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {area._count?.tasks ?? 0} tarefa(s)
                      {area.color ? ` · cor: ${area.color}` : ""}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(area.id)}
                      className="flex items-center gap-1 text-xs bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>

                    <button
                      onClick={() => deleteArea(area.id)}
                      className="flex items-center gap-1 text-xs bg-red-700 hover:bg-red-600 px-3 py-2 rounded"
                    >
                      <Trash size={14} />
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AreaEditRow({
  area,
  onCancel,
  onSave,
}: {
  area: Area;
  onCancel: () => void;
  onSave: (area: Area) => void;
}) {
  const [name, setName] = useState(area.name);
  const [icon, setIcon] = useState(area.icon ?? "");
  const [color, setColor] = useState(area.color ?? "");

  return (
    <div className="space-y-3">
      <input
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />

      <input
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() =>
            onSave({
              ...area,
              name,
              icon,
              color,
            })
          }
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}