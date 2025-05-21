// app/api/subcategories/route.ts
import { NextResponse } from 'next/server';
import { prismaClient } from '@/lib/prismaClient';

export async function GET() {
  try {
    const subcategories = await prismaClient.subcategory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ subcategories });
  } catch (error) {
    console.error('[GET_SUBCATEGORIES]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
