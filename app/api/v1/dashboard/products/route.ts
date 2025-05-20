import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";

export const GET = async (req: NextRequest) => {
  try {
    const products = await prismaClient.product.findMany({
      include: {
        images: {
          select: {
            url: true,
            altText: true,
            isPrimary: true,
          },
        },
        stocks: {
          select: {
            quantity: true,
            sku: true,
            barcode: true,
            location: true,
            variant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formatted = products.map((product) => {
      const totalStock = product.stocks.reduce(
        (sum, stock) => sum + stock.quantity,
        0
      );

      return {
        id: product.id,
        name: product.name,
        images: product.images,
        totalStock,
        stockCount: product.stocks.length,
        stocks: product.stocks,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const product = await prismaClient.product.create({
      data: body,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
};