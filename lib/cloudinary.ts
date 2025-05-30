import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiOptions } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

export default cloudinary;
function extractPublicIdFromUrl(imageUrl: string): string {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?([^/.]+)(?:\.[^/.]+)*$/);
    if (!match || !match[1]) {
        throw new Error(`Invalid Cloudinary image URL: ${imageUrl}`);
    }
    return match[1];
}

export const uploadTOCloudinary = async (file: File, folderName?: string) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const cloudinaryResult = await new Promise<any>((resolve, reject) => {
        const uploadOptions: UploadApiOptions = {
            resource_type: 'image', // Now properly typed as the literal "image"
            folder: folderName ? `ecommerce/${folderName}` : 'ecommerce'
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(new Error('Cloudinary upload failed'));
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
    
    return cloudinaryResult?.secure_url || '';
};
export const deleteFromCloudinary = async (imageUrl: string) => {
    const publicId = extractPublicIdFromUrl(imageUrl);
    console.log(publicId);
    // @ts-ignore
    return await cloudinary.uploader.destroy(publicId + '.webp');
};