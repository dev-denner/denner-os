import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateAreaSchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data = updateAreaSchema.parse(body);

  const area = await prisma.area.update({
    where: { id },
    data,
  });

  return NextResponse.json(area);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const taskCount = await prisma.task.count({
    where: { areaId: id },
  });

  if (taskCount > 0) {
    return NextResponse.json(
      {
        error:
          "Essa área possui tarefas. Mova ou exclua as tarefas antes de apagar.",
      },
      { status: 400 }
    );
  }

  await prisma.area.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}