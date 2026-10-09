const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function limpiar() {
  // Esta línea le dice a Prisma que borre TODOS los registros de la tabla Service
  await prisma.service.deleteMany();
  console.log("¡Base de datos limpia y lista para la entrega!");
}

limpiar();