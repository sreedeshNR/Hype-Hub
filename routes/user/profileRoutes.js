const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/user/profileController");
const { isLogin, checkBlocked } = require("../../middlewares/authMiddleware");
const upload = require("../../config/multer");


const uploadMiddleware = (req,res,next)=>{
    upload.single("profileImage")(req,res,(err)=>{
        if(err){
            req.uploadError = err.message
        }
        next()
    });
};

router.get("/profile", isLogin, checkBlocked, profileController.getProfile);
router.get("/profile/edit", isLogin, checkBlocked, profileController.getEditProfile);
router.post("/profile/edit", isLogin, checkBlocked, uploadMiddleware, profileController.postEditProfile);
router.get("/profile/change-password", isLogin, checkBlocked, profileController.getChangePassword);
router.post("/profile/change-password", isLogin, checkBlocked, profileController.postChangePassword);

router.get("/profile/change-email",isLogin,checkBlocked,profileController.getChangeEmail)
router.post("/profile/change-email",isLogin, checkBlocked,profileController.postChangeEmail)
router.get("/profile/verify-email-otp",isLogin,checkBlocked,profileController.getVerifyEmailOtp)
router.post("/profile/verify-email-otp",isLogin,checkBlocked,profileController.postVerifyEmailOtp)
router.post("/profile/resend-email-otp",isLogin,checkBlocked,profileController.resendEmailOtp)

module.exports = router;
