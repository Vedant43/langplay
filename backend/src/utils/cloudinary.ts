import { v2 as cloudinary } from 'cloudinary'//v2 coz updated ver has last parameter as callback,to differentiate 
import fs from 'fs'
import ApiError from './ApiError'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadImageOnCloudinary = async (localFilePath: string, userId: number) => {
    try {
        if(!localFilePath) {
            throw new ApiError(400, 'No file uploaded')
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image',
            public_id: `users/${userId}/thumbnail/${Date.now()}`
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
        console.error("Cloudinary image upload error:", error);
        throw new ApiError(500, error.message || "Cloudinary upload error", error);
    }
}

export const uploadVideoOnCloudinary = async (localFilePath: string, userId: number) => {
    try {
        if(!localFilePath) throw new ApiError(400, 'No file uploaded')
    
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "video",
            public_id:`users/${userId}/videos/${Date.now()}`, 
            transformation:[{
                quality:"auto"
            }]
        })
    
        if(response){
            console.log(response)
            fs.unlinkSync(localFilePath)
        }
    
        return { 
            public_id : response.public_id,
            secure_url: response.secure_url
        }
    } catch (error: any) {
        console.error("Cloudinary video upload error:", error);
        throw new ApiError(500, error.message || "Cloudinary upload error", error);
    }
}

// incorrect public id error