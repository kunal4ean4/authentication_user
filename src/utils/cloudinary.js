import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs"
// Configuration
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    const uploadOnCloudinary= async(localFilePath)=>{
        try {
            if(!localFilePath) return null
            // upload the file on cloudinary
            const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})

            //file has been successfull
            console.log("File is uploaded on cloudinary", (await response).url )
            return response
        } catch (error) {
                console.log("Cloudinary Error:", error);
            fs.unlinkSync(localFilePath)
            // remove the locally saved temporary file as the upload operation got failed
            return null
        }
    }

    export {uploadOnCloudinary}