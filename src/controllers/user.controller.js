import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser=asyncHandler(async(req,res)=>{
     const {fullName,email,password,userName}=req.body

    //Checking empty field
     if(
        [fullName,email,password,userName,].some((fields)=>fields?.trim() === "")
     ){
        throw new ApiError(400,"All fields are required!!")
     }

     //Checking existing user
     const existedUser=User.findOne({
        $or:[{ userName }, { email }]
     })
     if(existedUser){
        throw new ApiError(409,"User already existed")
     }

     //Checking profile picture in Loacl path
     const profilePictureLocalPath=req.files?.profilePicture[0].path;
     if(!profilePictureLocalPath){
        throw new ApiError(400,"Profile picture is required")
     }

     //Checking whether it's uploaded successfully or not!
     const profilePicture=await uploadOnCloudinary(profilePictureLocalPath)
     if(!accountPicture){
        throw new ApiError(400,"Profile picture is required")
     }

     //Creating the entry to the database
     const user=await User.create({
        userName,
        email,
        fullName,
        profilePicture:profilePicture.url,
        password,
        refreshToken
     })
     const createdUser=await User.findById(user._id).select("-password -refreshToken")

     if(createdUser){
        throw new ApiError(500,"Something went wrong while regestering the user")
     }

     return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
     )
     



     
    
})

export {registerUser}