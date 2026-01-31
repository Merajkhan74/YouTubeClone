import { Router } from "express";
import { registerUser } from "../controllers/User.controllers.js";
import {upload} from '../middlewares/multer.middleware.js'
const router = Router()

router.route('/register').post(
    // this is middleware code  jate time mil ke jaba 
    upload.fields([
        {
            name : "avatar",
            maxCount: 1
        },
        {
            name : "coverImage",
            maxCount :1
        }
    ]),
    registerUser)
// router.route('/login').post(login)
export default router