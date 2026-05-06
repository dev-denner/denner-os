import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  areaId: z.string().min(1),
  status: z.enum(["TODO", "DOING", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  dueDate: z.string().optional().nullable(),
  isRecurring: z.boolean().default(false),
  recurrence: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional().nullable(),
});

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      area: true,
    },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = taskSchema.parse(body);

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      areaId: data.areaId,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      isRecurring: data.isRecurring,
      recurrence: data.isRecurring ? data.recurrence : null,
    },
    include: {
      area: true,
    },
  });

  return NextResponse.json(task, { status: 201 });
}