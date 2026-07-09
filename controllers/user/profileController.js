const { validateEditProfile, validateChangePassword } = require("../../utils/validate");
const profileService = require("../../services/user/profileService")


// GET /profile
const getProfile = async (req, res, next) => {
  try {
    const user = await profileService.getUserById(req.session.user._id);
    const success = req.session.success || null;
    req.session.success = null;

    res.status(200).render("user/profile/profile", {
      title: "My Profile",
      user,
      success,
    });
  } catch (error) {
    next(error);
  }
};

// GET /profile/edit
const getEditProfile = async (req, res, next) => {
  try {
    const user = await profileService.getUserById(req.session.user._id);
    res.status(200).render("user/profile/edit-profile", {
      title: "Edit Profile",
      user,
      errors: {},
      success: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /profile/edit
const postEditProfile = async (req, res, next) => {
  try {
    const { fullName, username, phone } = req.body;
    const user = await profileService.getUserById(req.session.user._id);

    if (req.uploadError) {
      return res.status(400).render("user/profile/edit-profile", {
        title: "Edit Profile",
        user,
        errors: { general: req.uploadError },
        success: null,
      });
    }

    if (req.file && req.file.size > 2 * 1024 * 1024) {
      return res.status(400).render("user/profile/edit-profile", {
        title: "Edit Profile",
        user,
        errors: { general: "Image size must be less than 2MB." },
        success: null,
      });
    }

    const errors = validateEditProfile({ fullName, username, phone });
    if (Object.keys(errors).length > 0) {
      return res.status(400).render("user/profile/edit-profile", {
        title: "Edit Profile",
        user,
        errors,
        success: null,
      });
    }

    const existingUser = await profileService.checkUsernameExists(
      username,
      req.session.user._id,
    );

    if (existingUser) {
      return res.status(409).render("user/profile/edit-profile", {
        title: "Edit Profile",
        user,
        errors: { username: "Username already taken." },
        success: null,
      });
    }

    // Build update object ← was missing!
    const updateData = { fullName, username, phone };
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const updatedUser = await profileService.updateUserProfile(
      req.session.user._id,
      updateData,
      { new: true }
    );

    req.session.user.fullName = updatedUser.fullName;
    req.session.user.username = updatedUser.username;
    req.session.user.profileImage = updatedUser.profileImage;

    req.session.success = "Profile updated successfully!";
    res.redirect("/profile");

  } catch (error) {
    next(error);
  }
};

// GET /profile/change-password
const getChangePassword = async (req, res, next) => {
  try {
    const user = await profileService.getUserById(req.session.user._id);
    const isGoogleUser = !user.password;

    res.status(200).render("user/profile/change-password", {
      title: "Change Password",
      user,
      isGoogleUser,
      errors: {},
      success: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /profile/change-password
const postChangePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword, isGoogleUser } = req.body;
    const user = await profileService.getUserById(req.session.user._id);

    // Google user setting password
    if (isGoogleUser || !user.password) {
      if (!newPassword || !confirmPassword) {
        return res.status(400).render("user/profile/change-password", {
          title: "Change Password",
          user,
          isGoogleUser: true,
          errors: { newPassword: "Please fill all fields." },
          success: null,
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).render("user/profile/change-password", {
          title: "Change Password",
          user,
          isGoogleUser: true,
          errors: { confirmPassword: "Passwords do not match." },
          success: null,
        });
      }

      await profileService.updatePassword(req.session.user._id, newPassword)

      return res.render("user/profile/change-password", {
        title: "Change Password",
        user,
        isGoogleUser: false,
        errors: {},
        success: "Password set successfully!",
      });
    }

    // Normal user
    const errors = validateChangePassword({ currentPassword, newPassword, confirmPassword });
    if (Object.keys(errors).length > 0) {
      return res.status(400).render("user/profile/change-password", {
        title: "Change Password",
        user,
        isGoogleUser: false,
        errors,
        success: null,
      });
    }

    const isMatch = await profileService.verifyCurrentPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).render("user/profile/change-password", {
        title: "Change Password",
        user,
        isGoogleUser: false,
        errors: { currentPassword: "Current password is incorrect." },
        success: null,
      });
    }


    await profileService.updatePassword(req.session.user._id, newPassword)

    res.render("user/profile/change-password", {
      title: "Change Password",
      user,
      isGoogleUser: false,
      errors: {},
      success: "Password changed successfully!",
    });

  } catch (error) {
    next(error);
  }
};

// GET /profile/change-email
const getChangeEmail = async (req, res, next) => {
  try {
    const user = await profileService.getUserById(req.session.user._id);
    res.render("user/profile/change-email", {
      title: "Change Email",
      user,
      errors: {},
      success: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /profile/change-email
const postChangeEmail = async (req, res, next) => {
  try {
    const { newEmail } = req.body;
    const user = await profileService.getUserById(req.session.user._id);

    if (!newEmail || newEmail.trim() === "") {
      return res.status(400).render("user/profile/change-email", {
        title: "Change Email",
        user,
        errors: { newEmail: "Email is required." },
        success: null,
      });
    }

    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(newEmail.trim())) {
      return res.status(400).render("user/profile/change-email", {
        title: "Change Email",
        user,
        errors: { newEmail: "Enter a valid email address." },
        success: null,
      });
    }

    if (newEmail.trim() === user.email) {
      return res.status(400).render("user/profile/change-email", {
        title: "Change Email",
        user,
        errors: { newEmail: "New email must be different from current email." },
        success: null,
      });
    }

    const existingUser = await profileService.checkEmailExists(newEmail.trim());
    if (existingUser) {
      return res.status(409).render("user/profile/change-email", {
        title: "Change Email",
        user,
        errors: { newEmail: "Email already in use by another account." },
        success: null,
      });
    }


    try {
      await profileService.sendEmailOtp(newEmail.trim());
    } catch (emailError) {
      return res.status(400).render("user/profile/change-email", {
        title: "Change Email",
        user,
        errors: { newEmail: "Could not send OTP. Please check the email address." },
        success: null,
      });
    }

    req.session.pendingEmail = newEmail.trim();
    res.redirect("/profile/verify-email-otp");

  } catch (error) {
    next(error);
  }
};

// GET /profile/verify-email-otp
const getVerifyEmailOtp = async (req, res, next) => {
  try {
    if (!req.session.pendingEmail) {
      return res.redirect("/profile/change-email");
    }

    const user = await profileService.getUserById(req.session.user._id);
    res.render("user/profile/verify-email-otp", {
      title: "Verify Email",
      user,
      error: null,
      isOtpExpired: false,
    });
  } catch (error) {
    next(error);
  }
};

// POST /profile/verify-email-otp
const postVerifyEmailOtp = async (req, res, next) => {
  try {
    const newEmail = req.session.pendingEmail;
    const user = await profileService.getUserById(req.session.user._id);

    if (!newEmail) {
      return res.redirect("/profile/change-email");
    }

    const otp = [
      req.body.otp1, req.body.otp2, req.body.otp3,
      req.body.otp4, req.body.otp5, req.body.otp6,
    ].join("");

    try{
      await profileService.verifyEmailOtp(newEmail,otp)
    }catch(serviceError){
      return res.status(serviceError.status).render("user/profile/verify-email-otp",{
        title:"Verify Email",
        user,
        error: serviceError.message,
        isOtpExpired: serviceError.isExpired,
      })
    }

    await profileService.updateEmail(req.session.user._id, newEmail);

    req.session.user.email = newEmail;
    req.session.pendingEmail = null;
    req.session.success = "Email updated successfully!";
    res.redirect("/profile");

  } catch (error) {
    next(error);
  }
};

// POST /profile/resend-email-otp
const resendEmailOtp = async (req, res, next) => {
  try {
    const newEmail = req.session.pendingEmail;
    const user = await profileService.getUserById(req.session.user._id);

    if (!newEmail) {
      return res.redirect("/profile/change-email");
    }

    await profileService.resendEmailOtp(newEmail);

    res.render("user/profile/verify-email-otp", {
      title: "Verify Email",
      user,
      error: null,
      isOtpExpired: false,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
  getChangeEmail,
  postChangeEmail,
  getVerifyEmailOtp,
  postVerifyEmailOtp,
  resendEmailOtp,
};