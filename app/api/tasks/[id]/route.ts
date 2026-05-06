import { prisma } from "@/lib/prisma";
import { getNextDueDate } from "@/lib/recurrence";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  areaId: z.string().min(1).optional(),
  status: z.enum(["TODO", "DOING", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.string().optional().nullable(),
  isRecurring: z.boolean().optional(),
  recurrence: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data = updateSchema.parse(body);

  const currentTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!currentTask) {
    return NextResponse.json(
      { error: "Tarefa não encontrada" },
      { status: 404 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      areaId: data.areaId,
      status: data.status,
      priority: data.priority,
      dueDate:
        data.dueDate === undefined
          ? undefined
          : data.dueDate
            ? new Date(data.dueDate)
            : null,
      isRecurring: data.isRecurring,
      recurrence:
        data.isRecurring === false
          ? null
          : data.recurrence,
    },
    include: {
      area: true,
    },
  });

  const shouldCreateNext =
    data.status === "DONE" &&
    currentTask.status !== "DONE" &&
    currentTask.isRecurring &&
    currentTask.recurrence;

  if (shouldCreateNext) {
    await prisma.task.create({
      data: {
        title: currentTask.title,
        description: currentTask.description,
        areaId: currentTask.areaId,
        priority: currentTask.priority,
        status: "TODO",
        dueDate: getNextDueDate(currentTask.dueDate, currentTask.recurrence),
        isRecurring: true,
        recurrence: currentTask.recurrence,
      },
    });
  }

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}