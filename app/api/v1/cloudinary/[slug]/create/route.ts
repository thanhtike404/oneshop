import { NextRequest, NextResponse } from "next/server";
import { uploadTOCloudinary } from "@/lib/cloudinary"; // Adjust the import path as needed

export const revalidate = 0;

export const POST = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const { slug } = params;
    
    // Get FormData
    const formData = await req.formData();
    
    // Get files and metadata
    const files = formData.getAll('imageFiles') as File[];
    const metadataStr = formData.get('imageMetadata') as string;
    const metadata = JSON.parse(metadataStr);

    console.log('Received files:', files.length);
    console.log('Received metadata:', metadata);

    // Process and upload images using your existing function
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Use your existing upload function
        const uploadedUrl = await uploadTOCloudinary(file);
        
        if (!uploadedUrl) {
          throw new Error('Failed to upload image to Cloudinary');
        }

        // Return combined data
        return {
          url: uploadedUrl,
          altText: metadata[index]?.altText || '',
          isPrimary: metadata[index]?.isPrimary || false
        };
      } catch (error) {
        console.error(`Error uploading image ${index}:`, error);
        throw error;
      }
    });

    // Wait for all uploads to complete
    const uploadedImages = await Promise.all(uploadPromises);

    console.log('Uploaded images:', uploadedImages);

    return NextResponse.json({ 
      success: true,
      images: uploadedImages 
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload images',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
};



