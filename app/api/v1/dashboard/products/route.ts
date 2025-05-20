import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";

export const GET = async (req: NextRequest) => {
  try {
    // Get query parameters from URL
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');
    const name = searchParams.get('name');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Build the where clause for filtering
    const whereClause: any = {};
    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    if (subcategoryId) {
      whereClause.subcategoryId = subcategoryId;
    }
    
    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive' // Case-insensitive search
      };
    }
    
    const products = await prismaClient.product.findMany({
      where: whereClause, // Apply filters here
      take: limit,
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
        // Include category and subcategory if needed in response
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          }
        }
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
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice,
        images: product.images,
        totalStock,
        stockCount: product.stocks.length,
        stocks: product.stocks,
        // Include category info if needed
        category: product.category,
        subcategory: product.subcategory
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

// POST endpoint for creating new products
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