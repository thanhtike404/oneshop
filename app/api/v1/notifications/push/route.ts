import { NextRequest } from "next/server";
import { prismaClient } from "@/lib/prismaClient";
import { pushTokenSchema } from "@/schemas/pushTokenSchema";
export const POST = async (request: NextRequest) => {
    //  Create an API route to save Expo push tokens
   const {
    token,
    userId,
    platform,
   // Commented out if you have user information
   } = await request.json();
    // Validate the request body against the schema
    const validation = pushTokenSchema.safeParse({
         token,
         userId,
         platform,
    });
   if (!validation.success) {
      
        // says which field is missing sepcific error messages
         return new Response(JSON.stringify(validation.error.errors), { status: 400 });
           
   }
   try {
       const savedToken = await prismaClient.pushToken.create({
           data: {
                  token: token,
                  userId: userId,
               platform: 'something',
              
            }
       });
       return new Response(JSON.stringify(savedToken), { status: 201 });
   } catch (error) {
       console.error("Error saving push token:", error);
       return new Response("Failed to save push token", { status: 500 });
   }
}