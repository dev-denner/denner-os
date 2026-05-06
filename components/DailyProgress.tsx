type Task = {
  id: string;
  status: "TODO" | "DOING" | "DONE";
  dueDate?: Date | string | null;
};

function isToday(date?: Date | string | null) {
  if (!date) return false;

  const today = new Date();
  const taskDate = new Date(date);

  return (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  );
}

export default function DailyProgress({ tasks }: { tasks: Task[] }) {
  const todayTasks = tasks.filter((task) => isToday(task.dueDate));
  const doneTasks = todayTasks.filter((task) => task.status === "DONE");

  const total = todayTasks.length;
  const done = doneTasks.length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">📈 Progresso do dia</h2>
          <p className="text-sm text-zinc-400">
            {done} de {total} tarefas com vencimento hoje concluídas.
          </p>
        </div>

        <span className="text-2xl font-bold">{percentage}%</span>
      </div>

      <div className="mt-4 h-3 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}