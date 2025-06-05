import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient"; // Assuming you're using Prisma

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params; // No need to await params
    const { isFeatured } = await req.json(); // Parse the request body

    // Validate input
    if (typeof isFeatured !== 'boolean') {
      return NextResponse.json(
        { error: "isFeatured must be a boolean" },
        { status: 400 }
      );
    }

    // Update the product in database
    const updatedProduct = await prismaClient.product.update({
        where: { id },
        data: { isFeatured },
    });
    
    console.log(`Updating product ${id} isFeatured to ${isFeatured}`);
    console.log(`Updated product ${id} isFeatured to ${isFeatured}`);

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
};