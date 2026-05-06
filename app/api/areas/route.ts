import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const areaSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export async function GET() {
  const areas = await prisma.area.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return NextResponse.json(areas);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = areaSchema.parse(body);

  const area = await prisma.area.create({
    data,
  });

  return NextResponse.json(area, { status: 201 });
}