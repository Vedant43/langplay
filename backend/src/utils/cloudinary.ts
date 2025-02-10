import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import ApiError from './ApiError'

export const uploadOnCloudinary = async (localFilePath: string) => {
    
    try {
        if(!localFilePath) {
            throw new ApiError(400, 'No file uploaded')
        }
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
    
        if(response){
            console.log(response)
            fs.unlinkSync(localFilePath)
        }
        return { 
            public_id : response.public_id,
            secure_url: response.secure_url
        }
    } catch (error) {
        throw new ApiError(500, "Cloudinary upload error")
    }
}