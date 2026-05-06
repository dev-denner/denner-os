import { getAreaColorClasses } from "@/lib/areaColors";

type Area = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
};

type Task = {
  id: string;
  areaId: string;
  area: Area;
  status: "TODO" | "DOING" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export default function AreaMetrics({ tasks }: { tasks: Task[] }) {
  const areas = Array.from(
    new Map(tasks.map((task) => [task.area.id, task.area])).values()
  );

  return (
    <section className="grid md:grid-cols-4 gap-4">
      {areas.map((area) => {
        const areaTasks = tasks.filter((task) => task.area.id === area.id);
        const pending = areaTasks.filter((task) => task.status !== "DONE");
        const done = areaTasks.filter((task) => task.status === "DONE");
        const critical = areaTasks.filter(
          (task) => task.priority === "CRITICAL" && task.status !== "DONE"
        );

        const percentage =
          areaTasks.length === 0
            ? 0
            : Math.round((done.length / areaTasks.length) * 100);

        const colors = getAreaColorClasses(area.color);

        return (
          <a
            key={area.id}
            href={`/?areaId=${area.id}`}
            className={`rounded-2xl border p-5 transition hover:scale-[1.01] ${colors.soft} ${colors.card}`}
          >
            <h3 className={`font-bold text-lg ${colors.badge} inline-flex px-3 py-1 rounded-full border`}>
              {area.icon} {area.name}
            </h3>

            <div className="mt-4 space-y-1 text-sm text-zinc-300">
              <p>Total: {areaTasks.length}</p>
              <p>Pendentes: {pending.length}</p>
              <p>Feitas: {done.length}</p>
              <p
                className={
                  critical.length > 0 ? "text-red-400 font-semibold" : ""
                }
              >
                Críticas: {critical.length}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Progresso</span>
                <span>{percentage}%</span>
              </div>

              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </a>
        );
      })}
    </section>
  );
}