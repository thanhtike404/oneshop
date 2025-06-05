import { NextRequest ,NextResponse} from "next/server";
import { prismaClient } from "@/lib/prismaClient";
import { uploadTOCloudinary } from "@/lib/cloudinary";
export const GET = async (req: NextRequest) => {
    try {
        const sliders = await prismaClient.sliders.findMany();
        return NextResponse.json(sliders);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch sliders" },
            { status: 500 }
        );
    }
};

export const POST= async (req: NextRequest) => {
    try {
         const formData = await req.formData();
         const image= formData.get('image') as File;
         const title = formData.get('title') as string;
         try {
             const uploadedUrl = await uploadTOCloudinary(image, 'sliders');
             const slider = await prismaClient.sliders.create({
                 data: {
                     title: title,
                     image: uploadedUrl,
                 },
             });
             return NextResponse.json(slider);
         } catch (error) {
             console.error(error);
             return NextResponse.json(
                 { message: "Failed to create slider" },
                 { status: 500 }
             );
         }
   
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to create slider" },
            { status: 500 }
        );
    }
};