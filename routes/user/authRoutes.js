const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user/authController");
const { isLogin, isLogout } = require("../../middlewares/authMiddleware.js");
const passport = require("passport");

// Google Auth
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        req.session.blockedMessage = "Your account has been blocked. Contact support.";
        return res.redirect("/login");
      }

      req.session.user = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        username: req.user.username,
        profileImage: req.user.profileImage,
        role: req.user.role,
      };

      res.redirect("/home");

    } catch (error) {
      next(error);
    }
  }
);


// Register
router.get("/register", isLogout, authController.getRegister);
router.post("/register", authController.postRegister);

// OTP
router.get("/verify-otp", authController.getVerifyOtp);
router.post("/verify-otp", authController.postVerifyOtp);
router.post("/resend-otp", authController.resendOtp);

// Login
router.get("/login", isLogout, authController.getLogin);
router.post("/login", authController.postLogin);

// Forgot Password
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);

// Reset OTP
router.get("/verify-reset-otp", authController.getVerifyResetOtp);
router.post("/verify-reset-otp", authController.postVerifyResetOtp);

// Reset Password
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);

// Logout
router.get("/logout", isLogin, authController.logout);

module.exports = router;