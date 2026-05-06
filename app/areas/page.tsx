import { prisma } from "@/lib/prisma";
import AreasManager from "@/components/AreasManager";
import Link from "next/link";

export default async function AreasPage() {
  const areas = await prisma.area.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <section className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Áreas</h1>
            <p className="text-zinc-400 mt-2">
              Organize as áreas do seu Denner OS.
            </p>
          </div>

          <Link
            href="/"
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm"
          >
            Voltar
          </Link>
        </header>

        <AreasManager areas={areas} />
      </section>
    </main>
  );
}