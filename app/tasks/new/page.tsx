import { prisma } from "@/lib/prisma";
import NewTaskForm from "@/components/NewTaskForm";

export default async function NewTaskPage() {
  const areas = await prisma.area.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <NewTaskForm areas={areas} />;
}