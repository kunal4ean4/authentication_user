import { Router } from "express";
import { registerUser,loginUser,logOut,refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router=Router();

router.route("/register").post(
    upload.fields(
        [
            {name:"profilePicture", maxCount:1}
        ]
    )
    ,registerUser)

router.route("/login").post(loginUser)

//Secured routes
router.route("/logout").post(verifyJWT,logOut)
router.route("/refresh-token").post(refreshAccessToken)



export default router;