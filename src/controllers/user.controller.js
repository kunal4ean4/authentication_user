import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser=asyncHandler(async(req,res)=>{
    console.log("Register Controller Hit")
    res.status(200).json({
        message:"Done by Kunal"
    })
    console.log(res)
})

export {registerUser}