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
    
    // Extract the data from the request
    const {
      name,
      slug,
      description,
      basePrice,
      categoryId,
      subcategoryId,
      variants,
      images,
    } = body;

    // Handle empty subcategoryId
    const subcategoryIdValue = subcategoryId && subcategoryId.trim() !== "" ? subcategoryId : null;

    // Process images - replace blob URLs with placeholders for now
    // In production, you would upload these to a storage service first
    const processedImages = images.map((image: any) => ({
      url: image.url.replace("blob:http://localhost:3000/", "https://placeholder-image.com/"),
      altText: image.altText || "",
      isPrimary: image.isPrimary || false
    }));

    // Using a transaction to ensure all operations succeed or fail together
    const product = await prismaClient.$transaction(async (tx) => {
      // 1. Create the base product
      const newProduct = await tx.product.create({
        data: {
          name,
          slug,
          description,
          basePrice: parseFloat(String(basePrice)), // Ensure basePrice is a number
          categoryId,
          subcategoryId: subcategoryIdValue,
        }
      });
      
      // 2. Create the product variants
      for (const variant of variants) {
        const newVariant = await tx.productVariant.create({
          data: {
            name: variant.name,
            priceOffset: parseFloat(String(variant.priceOffset)), // Ensure priceOffset is a number
            productId: newProduct.id
          }
        });
        
        // 3. Create stocks for this variant
        if (variant.stocks && variant.stocks.length > 0) {
          for (const stock of variant.stocks) {
            await tx.stock.create({
              data: {
                productId: newProduct.id,
                variantId: newVariant.id,
                quantity: parseInt(String(stock.quantity)),
                location: stock.location || "",
                sku: stock.sku || null,
                barcode: stock.barcode || null
              }
            });
          }
        }
      }
      
      // 4. Create product images
      for (const image of processedImages) {
        await tx.productImage.create({
          data: {
            url: image.url,
            altText: image.altText,
            isPrimary: image.isPrimary,
            productId: newProduct.id
          }
        });
      }
      
      // 5. Return the complete product
      return tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          variants: {
            include: {
              stocks: true
            }
          },
          images: true,
          stocks: true
        }
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Failed to create product: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
};