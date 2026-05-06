import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não encontrada");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding...");

  // Limpa dados (opcional em dev)
  await prisma.task.deleteMany();
  await prisma.area.deleteMany();

  // Cria áreas
  const trabalho = await prisma.area.create({
    data: {
      name: "Trabalho",
      icon: "💻",
      color: "blue",
    },
  });

  const casa = await prisma.area.create({
    data: {
      name: "Casa",
      icon: "🏠",
      color: "green",
    },
  });

  const musica = await prisma.area.create({
    data: {
      name: "Música",
      icon: "🎤",
      color: "purple",
    },
  });

  const faculdade = await prisma.area.create({
    data: {
      name: "Faculdade",
      icon: "🎓",
      color: "yellow",
    },
  });

  // Cria tarefas exemplo
  await prisma.task.createMany({
    data: [
      {
        title: "Integração MAP Invest",
        description: "Finalizar integração dos serviços",
        areaId: trabalho.id,
        priority: "CRITICAL",
        status: "TODO",
        dueDate: new Date(),
      },
      {
        title: "Consertar vazamento da pia",
        areaId: casa.id,
        priority: "HIGH",
        status: "TODO",
      },
      {
        title: "Postar conteúdo diário",
        areaId: musica.id,
        priority: "HIGH",
        status: "TODO",
        isRecurring: true,
        recurrence: "DAILY",
        dueDate: new Date(),
      },
      {
        title: "Fazer prova da pós",
        areaId: faculdade.id,
        priority: "CRITICAL",
        status: "TODO",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      },
    ],
  });

  console.log("✅ Seed finalizado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });