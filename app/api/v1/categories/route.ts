// app/api/v1/categories/route.ts
import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'


export async function GET() {
  try {
    const categories = await prismaClient.category.findMany({
      include: {
        subcategories: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('[GET_CATEGORIES]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
