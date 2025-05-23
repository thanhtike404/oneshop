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