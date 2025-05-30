import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";
import { uploadTOCloudinary } from "@/lib/cloudinary";
import axios from "axios";

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
    const formData = await req.formData();
    
    // Debug logging
    console.log('Received FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
    }

    // 1. Extract basic product data
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const basePrice = parseFloat(formData.get('basePrice') as string);
    const categoryId = formData.get('categoryId') as string;
    const subcategoryId = formData.get('subcategoryId') as string;
    
    // 2. Parse variants data with validation
    const variantsDataString = formData.get('variantsData');
    console.log('Variants data string:', variantsDataString);

    let variantsData = [];
    try {
      if (variantsDataString && typeof variantsDataString === 'string') {
        variantsData = JSON.parse(variantsDataString);
        if (!Array.isArray(variantsData)) {
          throw new Error('Variants data is not an array');
        }
      }
    } catch (error) {
      console.error('Error parsing variants data:', error);
      throw new Error('Invalid variants data format');
    }

    console.log('Parsed variants data:', variantsData);

    // 3. Handle image files
    const imageFiles = formData.getAll('imageFiles') as File[];
    const imageMetadataString = formData.get('imageMetadata') as string;
    const imageMetadata = imageMetadataString ? JSON.parse(imageMetadataString) : [];

    // Upload images to Cloudinary
    const uploadPromises = imageFiles.map(async (file, index) => {
      try {
        const uploadedUrl = await uploadTOCloudinary(file,'product');
        
        if (!uploadedUrl) {
          throw new Error('Failed to upload image to Cloudinary');
        }

        return {
          url: uploadedUrl,
          altText: imageMetadata[index]?.altText || '',
          isPrimary: imageMetadata[index]?.isPrimary || false
        };
      } catch (error) {
        console.error(`Error uploading image ${index}:`, error);
        throw error;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    console.log('Uploaded images:', uploadedImages);

    // 4. Create product with all related data in a transaction
    const product = await prismaClient.$transaction(async (tx) => {
      // Create base product
      const newProduct = await tx.product.create({
        data: {
          name,
          slug,
          description,
          basePrice,
          categoryId,
          subcategoryId: subcategoryId || null,
        }
      });

      // Create variants and their stocks
      if (Array.isArray(variantsData) && variantsData.length > 0) {
        for (const variantData of variantsData) {
          const variant = await tx.productVariant.create({
            data: {
              name: variantData.name,
              priceOffset: parseFloat(String(variantData.priceOffset || 0)),
              productId: newProduct.id,
            }
          });

          // Create stocks for this variant
          if (Array.isArray(variantData.stocks)) {
            await Promise.all(variantData.stocks.map((stockData: any) =>
              tx.stock.create({
                data: {
                  productId: newProduct.id,
                  variantId: variant.id,
                  quantity: parseInt(String(stockData.quantity || 0)),
                  location: stockData.location || '',
                  sku: stockData.sku || null,
                  barcode: stockData.barcode || null
                }
              })
            ));
          }
        }
      }

      // Create product images
      if (uploadedImages.length > 0) {
        await Promise.all(uploadedImages.map((image) =>
          tx.productImage.create({
            data: {
              url: image.url,
              altText: image.altText,
              isPrimary: image.isPrimary,
              productId: newProduct.id
            }
          })
        ));
      }

      return tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          variants: {
            include: {
              stocks: true
            }
          },
          images: true
        }
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "Failed to create product",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
};