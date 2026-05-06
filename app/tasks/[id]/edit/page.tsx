import { prisma } from "@/lib/prisma";
import EditTaskForm from "@/components/EditTaskForm";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [task, areas] = await Promise.all([
    prisma.task.findUnique({
      where: { id },
      include: { area: true },
    }),
    prisma.area.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!task) {
    return <main className="p-6 text-white">Tarefa não encontrada.</main>;
  }

  return <EditTaskForm task={task} areas={areas} />;
}