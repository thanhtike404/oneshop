// lib/getCategories.ts
import { PrismaClient } from '@/prisma/generated';

export async function getCategories() {
  const prisma = new PrismaClient();
  
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}