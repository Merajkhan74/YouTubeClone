import { asyncHandle } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  console.log("email: ", email);

  if (
    [fullName, email, userName, password].some((filed) => filed.trim() === "")
  ) {
    throw new ApiError(400, "All fields are request ");
  }
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, " user with email or username are already exists ");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalpath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw ApiError(400, "avatar files or request ");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);
  if (!avatar) {
    throw new ApiError(400, "All fields are request ");
  }
  const User = awaitUser.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    userName: userName.toLowerCase(),
    coverImage: coverImage?.url || "",
  });
  const createUser = awaitUser
    .findById(userName._id)
    .select("-password -refreshToken");
  if (!createUser) {
    throw new ApiError("Somting is wrong while register the user ");
  }
  res.status(201).json(
    new ApiResponse(200 , createUser , "User Register SuccessFully ")
  )
});

export { registerUser };
