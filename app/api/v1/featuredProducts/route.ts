
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const category = searchParams.get('category');
    const featured = true;
    
    const skip = (page - 1) * limit;
    
    // Build where clause for home page specific needs
    const whereClause: any = {
      // Only show products that are in stock and active
      stocks: {
        some: {
          quantity: {
            gt: 0 // Greater than 0 stock
          }
        }
      }
    };
    
    if (category) {
      whereClause.category = {
        name: {
          equals: category,
          mode: 'insensitive'
        }
      };
    }
    
    // For featured products, you might have a featured field
    if (featured) {
      whereClause.isFeatured = true;
    }
    
    const [products, totalCount] = await Promise.all([
      prismaClient.product.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: [
          { isFeatured: 'desc' }, // Featured products first
          { createdAt: 'desc' }    // Then newest products
        ],
        include: {
          images: {
            // Get all images but order by isPrimary first
            orderBy: {
              isPrimary: 'desc'
            },
            select: {
              url: true,
              altText: true,
              isPrimary: true,
            },
          },
          stocks: {
            select: {
              quantity: true,
              variant: {
                select: {
                  name: true,
                },
              },
            },
          },
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
      }),
      prismaClient.product.count({ where: whereClause })
    ]);
    
    // Format data for mobile consumption
    const formatted = products.map((product) => {
      const totalStock = product.stocks.reduce(
        (sum, stock) => sum + stock.quantity,
        0
      );
      
      const availableSizes = product.stocks
        .filter(stock => stock.quantity > 0)
        .map(stock => stock.variant.name);
      
      // Get primary image or first image as fallback
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        isFearured: product.isFeatured,
        basePrice: product.basePrice,
        // Only primary image for home page (with fallback)
        image: primaryImage?.url || null,
        imageAlt: primaryImage?.altText || product.name,
        totalStock,
        availableSizes,
        isInStock: totalStock > 0,
        category: product.category?.name,
        subcategory: product.subcategory?.name,
        categoryId: product.category?.id,
        subcategoryId: product.subcategory?.id,
      };
    });
    
    // Return paginated response
    return NextResponse.json({
      products: formatted,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[PRODUCTS_GET]', error);
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Internal error', { status: 500 });
  }
};