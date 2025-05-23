import { prismaClient as prisma } from "@/lib/prismaClient"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          },
        },
        variants: {
          include: {
            stocks: true
          }
        },
        stocks: {
          include: {
            variant: true
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}