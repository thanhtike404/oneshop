import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";

export const GET = async (req: NextRequest) => {
  try {
    const categories = await prismaClient.category.findMany({
      include: {
        subcategories: true,
        products: true,
      },
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl } = body;

    const category = await prismaClient.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
};