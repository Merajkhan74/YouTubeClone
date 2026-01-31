import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: CLOUDINARY_API_KEY , 
        api_secret: CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async (localFilePath)=>{
        try {
            if(! localFilePath) return null 
            // upload the file on cloudinary
           const response = await cloudinary.uploader.upload(localFilePath , {
                resource_type : "auto",
            })
            // file uploaded successfully 
            console.log("File is uploaded in cloudnary ", response.url)
            return response 
        } catch (error) {
            fs.unlinkSync(localFilePath)// remove the locally save temporary file as the uploaded operation fail 
            return null 
        }
    }
//  const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);

w
export {uploadOnCloudinary}