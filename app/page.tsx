import { prisma } from "@/lib/prisma";
import KanbanBoard from "@/components/KanbanBoard";
import DashboardFilters from "@/components/DashboardFilters";
import AreaMetrics from "@/components/AreaMetrics";
import DailyProgress from "@/components/DailyProgress";
import WeeklyView from "@/components/WeeklyView";
import UnscheduledTasks from "@/components/UnscheduledTasks";
import OverduePanel from "@/components/OverduePanel";

const priorityWeight = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    areaId?: string;
    priority?: string;
    q?: string;
    period?: string;
  }>;
}) {
  const filters = await searchParams;

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);

  const periodWhere =
    filters.period === "OVERDUE"
      ? {
        dueDate: {
          lt: startOfToday,
        },
        status: {
          not: "DONE" as const,
        },
      }
      : filters.period === "TODAY"
        ? {
          dueDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        }
        : filters.period === "WEEK"
          ? {
            dueDate: {
              gte: startOfToday,
              lte: endOfWeek,
            },
          }
          : {};

  const where = {
    ...(filters.areaId ? { areaId: filters.areaId } : {}),
    ...(filters.priority ? { priority: filters.priority as any } : {}),
    ...periodWhere,
    ...(filters.q
      ? {
        OR: [
          {
            title: {
              contains: filters.q,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: filters.q,
              mode: "insensitive" as const,
            },
          },
        ],
      }
      : {}),
  };

  const [tasks, areas] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        area: true,
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    }),
    prisma.area.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const todayTasks = tasks
    .filter((task) => task.status !== "DONE")
    .sort((a, b) => {
      const priorityDiff =
        priorityWeight[b.priority] - priorityWeight[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      return dateA - dateB;
    })
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <section className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Denner OS</h1>
            <p className="text-zinc-400 mt-2">
              Central de rotina: Trabalho, Casa, Música e Faculdade.
            </p>
          </div>

          <DashboardFilters areas={areas} />
        </header>

        <div className="flex flex-wrap gap-3">
          <a
            href="/tasks/new"
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-medium"
          >
            + Nova tarefa
          </a>

          <a
            href="/focus"
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm font-medium"
          >
            🎯 Modo foco
          </a>

          <a
            href="/areas"
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-medium"
          >
            ⚙️ Gerenciar áreas
          </a>
        </div>

        <OverduePanel tasks={tasks} />

        <DailyProgress tasks={tasks} />

        <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <div>
            <h2 className="text-2xl font-bold">🎯 Hoje</h2>
            <p className="text-zinc-400 text-sm">
              Suas 3 prioridades reais do dia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            {todayTasks.map((task) => (
              <a
                key={task.id}
                href={`/tasks/${task.id}/edit`}
                className="rounded-xl bg-zinc-800 border border-zinc-700 p-4 hover:bg-zinc-700 transition"
              >
                <p className="font-semibold">{task.title}</p>

                <p className="text-sm text-zinc-400 mt-2">
                  {task.area.icon} {task.area.name} · {task.priority}
                </p>

                {task.dueDate && (
                  <p className="text-xs text-zinc-500 mt-2">
                    📅 {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </a>
            ))}

            {todayTasks.length === 0 && (
              <p className="text-zinc-400">Nenhuma tarefa pendente.</p>
            )}
          </div>
        </section>

        <AreaMetrics tasks={tasks} />

        <WeeklyView tasks={tasks} />

        <UnscheduledTasks tasks={tasks} />

        <KanbanBoard tasks={tasks} />
      </section>
    </main>
  );
}