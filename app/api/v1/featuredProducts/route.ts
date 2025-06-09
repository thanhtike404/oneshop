import { prismaClient } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "4");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;

  const category = searchParams.get("category");

  const whereClause: any = {
    isFeatured: true, // Always fetch featured products
    
  };


  const products = await prismaClient.product.findMany({
    where: whereClause,
    include: {
      stocks: true,
      category: true,
      subcategory: true,
      images:{
        where:{
          isPrimary:true
        }
      }
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
  const transformedProducts = products.map((product) => ({
    ...product,
    image: product.images?.[0]?.url || null,
    images: undefined, // remove original images array
  }));

  const totalItems = await prismaClient.product.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalItems / limit);

  return NextResponse.json({
    products:transformedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}
