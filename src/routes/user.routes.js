import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  RefreshAccessToken,
  ChangeCurrentPassword,
  getCurrentUser,
   updateAccountDetails,
  updateUserAvatar,
  
  getUserChannelProfile,
  getWatchHistory,
  updateUserCoverImage,
} from "../controllers/User.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middlewares.js";
const router = Router();

router.route("/register").post(
  // this is middleware code :-  jate time mil ke jana
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-Token").post(RefreshAccessToken);
router.route("/change-password").post(verifyJWT, ChangeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:userName").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;
