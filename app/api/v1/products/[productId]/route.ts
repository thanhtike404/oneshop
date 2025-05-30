import {  prismaClient } from "@/lib/prismaClient"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = await params;
    
    const product = await prismaClient.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        variants: {
          include: {
            stocks: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { productIds } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return new NextResponse('No product IDs provided', { status: 400 });
    }

    const deleted = await prismaClient.product.deleteMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    return NextResponse.json({ count: deleted.count });
  } catch (error) {
    console.error('[PRODUCTS_DELETE_MANY]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}