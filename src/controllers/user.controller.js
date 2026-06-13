import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating and accessing the tokens",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, userName } = req.body;

  //Checking empty field
  if (
    [fullName, email, password, userName].some(
      (fields) => fields?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }

  //Checking existing user
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already existed");
  }

  //Checking profile picture in Loacl path

  const profilePictureLocalPath = req.files?.profilePicture[0]?.path;
  console.log("profilePictureLocalPath:", profilePictureLocalPath);
  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  //Checking whether it's uploaded successfully or not!
  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  console.log("Cloudinary Response:", profilePicture);
  if (!profilePicture) {
    throw new ApiError(400, "Profile picture is required");
  }

  //Creating the entry to the database
  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    profilePicture: profilePicture.url,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regestering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Check User existed or not
  // Password correct or not
  // Check username or email
  //Access and Refresh Token
  //Send cookies
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "Username or Password is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

//When user is logged out then they have another endpoint to hit the refreshAccessToken so that there will be no logout
const refreshAccessToken = asyncHandler(async (req, res) => {
  const inComingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!inComingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }
  try {
   const decodedToken = jwt.verify(
     inComingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET,
   );
 
   const user = await User.findById(decodedToken?._id);
 
   if (!user) {
     throw new ApiError(401, "Invalid Refres Token");
   }
 
   if (inComingRefreshToken !== user?.refreshToken) {
     throw new ApiError(401, "Refresh token is expired or used");
   }
 
   const options = {
     httpOnly: true,
     secure: true,
   };
 
   const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(
     user._id,
   );
 
   return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
       new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access Token Refreshed"
       )
     )
  } catch (error) {
   throw new ApiError(401,error?.message || "Invalid refresh token")
  }
});

export { registerUser, loginUser, logOut, refreshAccessToken };
