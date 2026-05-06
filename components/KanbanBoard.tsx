"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAreaColorClasses } from "@/lib/areaColors";

type Area = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  areaId: string;
  area: Area;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "TODO" | "DOING" | "DONE";
  dueDate?: Date | string | null;
  isRecurring: boolean;
  recurrence?: "DAILY" | "WEEKLY" | "MONTHLY" | null;
};

const statusLabels = {
  TODO: "A fazer",
  DOING: "Em execução",
  DONE: "Concluído",
};

function getPriorityStyle(priority: Task["priority"]) {
  if (priority === "CRITICAL") return "border-red-500/70 bg-red-950/30";
  if (priority === "HIGH") return "border-orange-500/70 bg-orange-950/30";
  if (priority === "MEDIUM") return "border-yellow-500/60 bg-yellow-950/20";
  return "border-zinc-700 bg-zinc-800";
}

function getPriorityLabel(priority: Task["priority"]) {
  if (priority === "CRITICAL") return "Crítica";
  if (priority === "HIGH") return "Alta";
  if (priority === "MEDIUM") return "Média";
  return "Baixa";
}

function getRecurrenceLabel(recurrence?: Task["recurrence"]) {
  if (recurrence === "DAILY") return "Diária";
  if (recurrence === "WEEKLY") return "Semanal";
  if (recurrence === "MONTHLY") return "Mensal";
  return "";
}

function isOverdue(dueDate?: Date | string | null, status?: Task["status"]) {
  if (!dueDate || status === "DONE") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(dueDate);
  taskDate.setHours(0, 0, 0, 0);

  return taskDate < today;
}

function getOverdueStyle(dueDate?: Date | string | null, status?: Task["status"]) {
  return isOverdue(dueDate, status)
    ? "ring-2 ring-red-500/70 shadow-red-900/40 shadow-lg"
    : "";
}

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const router = useRouter();

  const columns: Record<Task["status"], Task[]> = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    DOING: tasks.filter((task) => task.status === "DOING"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };

  async function updateTaskStatus(id: string, status: Task["status"]) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    router.refresh();
  }

  async function handleDelete(id: string) {
    const ok = confirm("Excluir essa tarefa?");
    if (!ok) return;

    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;

    const { draggableId, destination, source } = result;

    if (source.droppableId === destination.droppableId) return;

    updateTaskStatus(draggableId, destination.droppableId as Task["status"]);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="grid md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, items]) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl min-h-[300px]"
              >
                <h2 className="font-bold mb-4">
                  {statusLabels[status as Task["status"]]} ({items.length})
                </h2>

                {items.map((task, index) => {
                  const areaColors = getAreaColorClasses(task.area.color);

                  return (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <article
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`border p-3 rounded-xl mb-2 ${getPriorityStyle(
                            task.priority
                          )} ${getOverdueStyle(task.dueDate, task.status)}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{task.title}</h3>

                              <div
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs mt-2 ${areaColors.badge}`}
                              >
                                <span>{task.area.icon}</span>
                                <span>{task.area.name}</span>
                              </div>

                              <p className="text-xs text-zinc-400 mt-1">
                                Prioridade: {getPriorityLabel(task.priority)}
                              </p>

                              {task.dueDate && (
                                <p className="text-xs text-zinc-400 mt-1">
                                  📅{" "}
                                  {new Date(task.dueDate).toLocaleDateString(
                                    "pt-BR"
                                  )}
                                </p>
                              )}

                              {isOverdue(task.dueDate, task.status) && (
                                <p className="text-xs text-red-300 font-semibold mt-2">
                                  ⚠️ Vencida
                                </p>
                              )}
                            </div>

                            {task.isRecurring && (
                              <span className="shrink-0 rounded-full bg-zinc-700 px-2 py-1 text-[11px] text-zinc-200">
                                🔁 {getRecurrenceLabel(task.recurrence)}
                              </span>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-sm text-zinc-300 mt-3">
                              {task.description}
                            </p>
                          )}

                          <div className="flex justify-end gap-2 mt-4">
                            <a
                              href={`/tasks/${task.id}/edit`}
                              className="flex items-center gap-1 text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded"
                            >
                              <Pencil size={14} />
                              Editar
                            </a>

                            <button
                              onClick={() => handleDelete(task.id)}
                              className="flex items-center gap-1 text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded"
                            >
                              <Trash size={14} />
                              Excluir
                            </button>
                          </div>
                        </article>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </section>
    </DragDropContext>
  );
}