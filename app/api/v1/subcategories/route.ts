import { NextResponse } from "next/server"
import { prismaClient } from "@/lib/prismaClient"

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { categoryId, name, slug, description, iconUrl } = body

    if (!categoryId || !name || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if subcategory with same slug exists
    const existingSubcategory = await prismaClient.subcategory.findFirst({
      where: { 
        categoryId,
        slug 
      },
    })

    if (existingSubcategory) {
      return NextResponse.json(
        { error: "Subcategory with this slug already exists" },
        { status: 409 }
      )
    }

    // Create subcategory
    const subcategory = await prismaClient.subcategory.create({
      data: {
        categoryId,
        name,
        slug,
        description,
        iconUrl,
      },
    })

    return NextResponse.json(subcategory, { status: 201 })
  } catch (error) {
    console.error("Error creating subcategory:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
