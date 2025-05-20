// app/lib/getProducts.ts
import { PrismaClient } from '@/prisma/generated';

const prisma = new PrismaClient();

export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      images: {
        where: { isPrimary: true },
        take: 1
      },
    },
    take: 10, // show only 10 for now
    orderBy: { createdAt: 'desc' },
  });
}
