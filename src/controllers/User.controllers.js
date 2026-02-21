import { asyncHandle } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokem = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, " user not found ");
    }
    // const AccessToken = user.generateAccessToken();
    // const refreshToken = user.generateRefeshToken();
    const AccessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, AccessToken };
  } catch (error) {
    throw new ApiError(
      505,
      "someting went to wrong while grnerate refersh  and Access token "
    );
  }
  //   catch (error) {
  //   console.log("🔥🔥 REAL ERROR FROM TOKEN FUNCTION 🔥🔥");
  //   console.log(error);
  //   console.log("🔥🔥 END 🔥🔥");
  //   throw error; // VERY IMPORTANT
  // }
};

const registerUser = asyncHandle(async (req, res) => {
  // res.status(200).json({
  //     message :'ok'
  // })

  //get user details  from frontend / user
  // validation  - not empty
  // check if user is already exist : username , email ,
  // check your image and check your avatar
  // upload them to cloudnary avatar
  // create your object  create entry avatar in db
  // remove password and refresh token field from response
  //   check user creation
  // return res

  const { fullName, email, userName, password } = req.body;
  // console.log(req.body)

  if (
    [fullName, email, userName, password].some(
      (filed) => !filed || filed.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are request ");
  }
  // check if user is already exist : username , email ,
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, " user with email or username are already exists ");
  }

  // check your image and check your avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let coverImageLocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalpath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar files or request ");
  }

  // upload them to cloudnary avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new ApiError(400, "All fields are request ");
  }
  // create your object  create entry avatar in db
  const user = await User.create({
    fullName,
    email,
    avatar: avatar.url,
    password,
    userName: userName.toLowerCase(),
    coverImage: coverImage?.url || "",
  });
  // remove password and refresh token field from response

  // const createUser = await User
  //   .findById(user._id)
  //   .select("-password -refreshToken");

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError("Somting is wrong while register the user ");
  }
  // return res
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register SuccessFully "));
});

//  ----------- login todo  -------------

const loginUser = asyncHandle(async (req, res) => {
  console.log("BODY:", req.body);

  // request body
  // userName or email
  // find user
  // password check
  // access and refersh toen
  // send cooke
  //  return res

  // request body

  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "userName or Email is required ");
  }
  // find User
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user does not exist ");
  }

  // password check
  const ispasswordValid = await user.isPasswordCorrect(password);
  if (!ispasswordValid) {
    throw new ApiError(401, " password is not correct ");
  }

  const { AccessToken, refreshToken } = await generateAccessAndRefreshTokem(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("AccessToken", AccessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200),
      {
        user: loggedInUser,
        refreshToken,
        AccessToken,
      },
      "User Logged in SuccessFully "
    );
});

const logoutUser = asyncHandle(async (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const RefreshAccessToken = asyncHandle(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  // eq.body.refreshToken ye mobilw apps ke liye hota ha hoo sakta ha koye moblie app se access karne ke koshis karta hoo

  if (!incomingRefreshToken) {
    throw new ApiError(404, "unAuthorized Resuest ");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "Invalid Token");
    }
    if (!incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(404, "Refresh token Expired  or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newRefreshToken, accessToken } =
      await generateAccessAndRefreshTokem(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken })
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh token ");
  }
});

const ChangeCurrentPassword = asyncHandle(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }
  ((user.password = newPassword),
    await user.save({ validateBeforeSave: false }));

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Change Successfully"));
});

const getCurrentUser = asyncHandle(async (req, res) => {
  return res
    .status(200)
    .json( new ApiResponse (200, req.user, "Current User Fatched successFully "));
});

const updateAccountDetails = asyncHandle(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All filed are required ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiError(200, user, "Account Details Update succcessFully "));
});

const updateUserAvatar = asyncHandle(async (req, res) => {
  const AvatarLocalPath = req.file?.path;
  if (!AvatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing ");
  }
  const avatar = await uploadOnCloudinary(AvatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Avater Update successFully "));
});

const updateUserCoverImage = asyncHandle(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "cover Image  file is missing ");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage Upatated successfully "));
});


const getUserChannelProfile = asyncHandle(async(req, res)=>{

  const {userName}= req.params
  if (!userName?.trim()) {
    throw new ApiError(400, "UserName is missing")
  }

   const channel = await User.aggregate([
    // filter one document 
    {
      $match:{
        userName: userName?.toLowerCase()
      },
      $lookup:{
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as:"subscribers"
      }
    },
      {
        $lookup:{
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as:"subscribedTo"  
        }
      },
      {
        $addFields:{
          subscribersCount:{
            $size: "$subscribers"
          },
          channeltoSubscribedCount:{
            $size:"subscribedTo"
          },
          isSubscribed:{
            $cond:{
              if:{$in: [req.user?._id, "$subscribers.subscriber"]},
              then:true,
              else: false
            }
          }
        }
      },
      {
        $project:{
          fullName:1,
          userName:1,
          subscribersCount:1,
          channeltoSubscribedCount:1,
          isSubscribed:1,
          avatar:1,
          coverImage:1,
          email:1,

        }
      }

   ])
   console.log(channel)
   if(!channel?.length){
    throw new ApiError(404, "channel does not exists")
   }
   return res 
   .status(200)
   .json(
    new ApiResponse(200, channel[0], "User Channel fetch successfully ")
   )
})
const getWatchHistory = asyncHandle(async(req, res)=>{
  // get user watch history 
  // populate video details in watch history 
  // return response 
  const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as:"watchHistory",
        //lookup ke ander bhi lookup karna ha taki watch history ke ander video details bhi aa jaye
        pipeline:[
          {
            $lookup:{
              from: "user",
              localField: "owner",
              foreignField: "_id",
              as:"owner",
              // ak or pipeline ke ander bhi lookup karna ha taki video ke owner ke details bhi aa jaye
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    userName:1,
                    avatar:1,
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              onwer:{
                $first: "$owner",
              }
            }
          }
        ]
      }
    }
  ])
  return res
  .status(200)
  .json(
    new ApiResponse(200, user[0].watchHistory, "User Watch history fetch successfully ")
  )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  RefreshAccessToken,
  ChangeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
