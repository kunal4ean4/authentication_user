import { Router } from "express";
import {
  registerUser,
  loginUser,
  logOut,
  refreshAccessToken,
  currentUser,
  changeCurrentPassword,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "profilePicture", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);

//Secured routes
router.route("/logout").post(verifyJWT, logOut);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/currentUser").get(verifyJWT, currentUser);
router.route("/changeCurrentPassword").post(verifyJWT, changeCurrentPassword);
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword);

export default router;
