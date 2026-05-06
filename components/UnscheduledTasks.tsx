import ScheduleButtons from "@/components/ScheduleButtons";

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

const priorityLabels = {
  CRITICAL: "Crítica",
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

export default function UnscheduledTasks({ tasks }: { tasks: Task[] }) {
  const unscheduledTasks = tasks.filter(
    (task) => !task.dueDate && task.status !== "DONE"
  );

  if (unscheduledTasks.length === 0) return null;

  return (
    <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold">🕳️ Sem data definida</h2>
        <p className="text-sm text-zinc-400">
          Tarefas pendentes que ainda precisam entrar no calendário.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {unscheduledTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl bg-zinc-800 border border-zinc-700 p-4 hover:bg-zinc-700 transition"
          >
            <a
              href={`/tasks/${task.id}/edit`}
              className="font-semibold hover:underline"
            >
              {task.title}
            </a>

            <div className="flex flex-wrap gap-2 mt-3 text-xs text-zinc-300">
              <span className="rounded-full bg-zinc-900 px-2 py-1">
                {task.area.icon} {task.area.name}
              </span>

              <span className="rounded-full bg-zinc-900 px-2 py-1">
                {priorityLabels[task.priority]}
              </span>
            </div>

            <ScheduleButtons taskId={task.id} />
          </div>
        ))}
      </div>
    </section>
  );
}