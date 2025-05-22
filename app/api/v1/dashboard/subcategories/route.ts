import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, slug, description, iconUrl, categoryId } = body;

    const subcategory = await prismaClient.subcategory.create({
      data: {
        name,
        slug,
        description,
        iconUrl,
        categoryId,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create subcategory" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const whereClause = categoryId ? { categoryId } : {};

    const subcategories = await prismaClient.subcategory.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
};