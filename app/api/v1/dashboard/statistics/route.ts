import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";

export const GET = async (req: NextRequest) => {
  try {
    // Get total counts
    const productCount = await prismaClient.product.count();
    const categoryCount = await prismaClient.category.count();
    const variantCount = await prismaClient.productVariant.count();
    
    // Get stock information
    const stocks = await prismaClient.stock.findMany({
      select: {
        quantity: true,
        product: {
          select: {
            name: true,
            categoryId: true,
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    
    // Calculate total stock
    const totalStock = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    
    // Calculate stock by category
    const stockByCategory = stocks.reduce((acc, stock) => {
      const categoryName = stock.product.category?.name || 'Uncategorized';
      
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      
      acc[categoryName] += stock.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    // Format stock by category for charts
    const stockByCategoryData = Object.entries(stockByCategory).map(([name, stock]) => ({
      name,
      stock
    }));
    
    // Get low stock products (less than 10 items)
    const lowStockProducts = await prismaClient.product.findMany({
      where: {
        stocks: {
          some: {
            quantity: {
              lt: 10
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        stocks: {
          select: {
            quantity: true,
            variant: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    
    // Format low stock products
    const lowStockFormatted = lowStockProducts.map(product => ({
      id: product.id,
      name: product.name,
      variants: product.stocks
        .filter(stock => stock.quantity < 10)
        .map(stock => ({
          name: stock.variant.name,
          quantity: stock.quantity
        }))
    }));
    
    // Return the statistics data
    return NextResponse.json({
      overview: {
        productCount,
        categoryCount,
        variantCount,
        totalStock
      },
      stockByCategory: stockByCategoryData,
      lowStock: lowStockFormatted
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
};