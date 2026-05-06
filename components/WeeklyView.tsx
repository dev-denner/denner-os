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

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekDays() {
  const today = startOfDay(new Date());

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });
}

export default function WeeklyView({ tasks }: { tasks: Task[] }) {
  const days = getWeekDays();

  return (
    <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold">📅 Próximos 7 dias</h2>
        <p className="text-sm text-zinc-400">
          Tarefas organizadas por vencimento.
        </p>
      </div>

      <div className="grid md:grid-cols-7 gap-3">
        {days.map((day) => {
          const dayTasks = tasks.filter((task) => {
            if (!task.dueDate) return false;
            return isSameDay(new Date(task.dueDate), day);
          });

          return (
            <div
              key={day.toISOString()}
              className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 min-h-[180px]"
            >
              <h3 className="font-semibold text-sm">
                {day.toLocaleDateString("pt-BR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </h3>

              <div className="mt-3 space-y-2">
                {dayTasks.length === 0 && (
                  <p className="text-xs text-zinc-500">Sem tarefas</p>
                )}

                {dayTasks.map((task) => (
                  <a
                    key={task.id}
                    href={`/tasks/${task.id}/edit`}
                    className={`block rounded-lg p-2 text-xs border ${
                      task.status === "DONE"
                        ? "bg-zinc-900 border-zinc-800 text-zinc-500 line-through"
                        : "bg-zinc-800 border-zinc-700 text-zinc-200"
                    }`}
                  >
                    <div className="font-medium">
                      {task.area.icon} {task.title}
                    </div>

                    <div className="text-[11px] text-zinc-400 mt-1">
                      {task.area.name} · {priorityLabels[task.priority]}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}