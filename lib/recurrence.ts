export function getNextDueDate(
  dueDate: Date | null,
  recurrence: "DAILY" | "WEEKLY" | "MONTHLY" | null
) {
  const base = dueDate ? new Date(dueDate) : new Date();

  if (recurrence === "DAILY") {
    base.setDate(base.getDate() + 1);
  }

  if (recurrence === "WEEKLY") {
    base.setDate(base.getDate() + 7);
  }

  if (recurrence === "MONTHLY") {
    base.setMonth(base.getMonth() + 1);
  }

  return base;
}