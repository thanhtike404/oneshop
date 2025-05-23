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
    const { name, slug, description, imageUrl, subcategories } = body;

    // Using a transaction to ensure both category and subcategories are created
    const category = await prismaClient.$transaction(async (tx) => {
      // Create the category first
      const newCategory = await tx.category.create({
        data: {
          name,
          slug,
          description,
          imageUrl,
        },
      });

      // If subcategories are provided, create them
      if (subcategories && Array.isArray(subcategories)) {
        for (const sub of subcategories) {
          await tx.subcategory.create({
            data: {
              name: sub.name,
              slug: sub.slug,
              description: sub.description,
              iconUrl: sub.iconUrl,
              categoryId: newCategory.id,
            },
          });
        }
      }

      // Return the complete category with subcategories
      return tx.category.findUnique({
        where: { id: newCategory.id },
        include: {
          subcategories: true,
        },
      });
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