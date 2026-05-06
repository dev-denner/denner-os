import OverduePanelClient from "@/components/OverduePanelClient";

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

function isOverdue(date?: Date | string | null, status?: string) {
  if (!date || status === "DONE") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  return taskDate < today;
}

export default function OverduePanel({ tasks }: { tasks: Task[] }) {
  const overdueTasks = tasks.filter((task) =>
    isOverdue(task.dueDate, task.status)
  );

  if (overdueTasks.length === 0) return null;

  return <OverduePanelClient tasks={overdueTasks} />;
}