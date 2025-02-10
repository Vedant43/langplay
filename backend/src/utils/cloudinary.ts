import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import ApiError from './ApiError'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath: string) => {
    
    try {
        if(!localFilePath) {
            throw new ApiError(400, 'No file uploaded')
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })

        if(response){
            console.log("Response from cloudinary " + response)
            fs.unlinkSync(localFilePath)
        }
        return { 
            public_id : response.public_id,
            secure_url: response.secure_url
        }
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        throw new ApiError(500, error.message || "Cloudinary upload error", error);
    }
}