import { prisma } from "@/lib/prisma";
import FocusTaskActions from "@/components/FocusTaskActions";
import Link from "next/link";

const priorityWeight = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

function isOverdue(date?: Date | string | null) {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  return taskDate < today;
}

export default async function FocusPage() {
  const tasks = await prisma.task.findMany({
    where: {
      status: {
        not: "DONE",
      },
    },
    include: {
      area: true,
    },
  });

  const focusTasks = tasks
    .sort((a, b) => {
      const overdueA = isOverdue(a.dueDate) ? 1 : 0;
      const overdueB = isOverdue(b.dueDate) ? 1 : 0;

      if (overdueA !== overdueB) return overdueB - overdueA;

      const priorityDiff =
        priorityWeight[b.priority] - priorityWeight[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      return dateA - dateB;
    })
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <section className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">🎯 Modo Foco</h1>
            <p className="text-zinc-400 mt-2">
              Só as 3 tarefas que mais importam agora.
            </p>
          </div>

          <Link
            href="/"
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm"
          >
            Voltar
          </Link>
        </header>

        <div className="space-y-4">
          {focusTasks.map((task, index) => (
            <article
              key={task.id}
              className={`rounded-2xl border p-5 ${
                isOverdue(task.dueDate)
                  ? "bg-red-950/30 border-red-500/70 ring-2 ring-red-500/50"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <div>
                <span className="text-sm text-zinc-500">
                  Prioridade #{index + 1}
                </span>

                <h2 className="text-2xl font-bold mt-1">{task.title}</h2>

                {isOverdue(task.dueDate) && (
                  <p className="mt-3 text-sm font-semibold text-red-300">
                    ⚠️ Esta tarefa está vencida
                  </p>
                )}

                {task.description && (
                  <p className="text-zinc-300 mt-3">{task.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4 text-xs text-zinc-300">
                  <span className="rounded-full bg-zinc-800 px-3 py-1">
                    {task.area.icon} {task.area.name}
                  </span>

                  <span className="rounded-full bg-zinc-800 px-3 py-1">
                    {task.priority}
                  </span>

                  {task.dueDate && (
                    <span className="rounded-full bg-zinc-800 px-3 py-1">
                      📅 {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  )}

                  {task.isRecurring && (
                    <span className="rounded-full bg-zinc-800 px-3 py-1">
                      🔁 {task.recurrence}
                    </span>
                  )}
                </div>
              </div>

              <FocusTaskActions taskId={task.id} />
            </article>
          ))}

          {focusTasks.length === 0 && (
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center">
              <h2 className="text-2xl font-bold">Tudo em dia 🎉</h2>
              <p className="text-zinc-400 mt-2">
                Nenhuma tarefa pendente no momento.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}