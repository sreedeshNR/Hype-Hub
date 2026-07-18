const { validateRegister, validateLogin, validateResetPassword } = require("../../utils/validate");
const authService = require("../../services/user/authService")

const getRegister = (req,res)=>{
  res.render("user/auth/register",{
    title: "Register",
    errors: {},
    formData: {},
    layout: false
  })
}


const postRegister = async(req,res,next) =>{
  try{
    const { fullName, username, email, phone, password, confirmPassword } = req.body;

    const errors = validateRegister({ fullName, username, email, phone, password, confirmPassword });
    
    if(Object.keys(errors).length > 0){
      return res.status(400).render("user/auth/register",{
        title: "Register",
        errors,
        formData: { fullName, username, email, phone },
        layout: false,
      })
    }

    try{
      await authService.registerUser({ fullName, username, email, phone, password })
    }catch(serviceError){
      return res.status(serviceError.status || 400).render("user/auth/register",{
        title: "Register",
        errors: { [serviceError.field]: serviceError.message},
        formData: { fullName, username, email, phone },
        layout: false
      })
    }

    try{
      await authService.sendOtp(email);
    }catch (emailError){
      return res.status(400).render("user/auth/register",{
        title:"Register",
        errors:{ email: "Could not send OTP. Please check your email address."},
        formData: { fullName , username, email, phone},
        layout: false,
      });
    }

    req.session.otpEmail = email;
    res.redirect("/verify-otp");

  }catch (error){
    next(error)
  }
};

const getVerifyOtp = (req,res)=>{
  if(!req.session.otpEmail){
    return res.redirect("/register")
  }

  res.render("user/auth/verify-otp",{
    title: "Verify OTP",
    error: null,
    isOtpExpired : false,
    layout: false,
  });
}


const postVerifyOtp = async(req,res,next)=>{
  try{
    const email = req.session.otpEmail;
    if(!email) return res.redirect("/register")

      const otp = [
        req.body.otp1, req.body.otp2,req.body.otp3,
        req.body.otp4,req.body.otp5,req.body.otp6,
      ].join("");

      try{
        const user = await authService.verifyOtp(email, otp)

        req.session.otpEmail = null

        if(req.session.fromLogin){
          req.session.fromLogin = null
          req.session.user = {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profileImage: user.profileImage,
            role: user.role
          }
          return res.redirect("/home")
        }

        req.session.success = "Account verified! Please login.";
        return res.redirect("/login")

      }catch(serviceError){
        return res.status(serviceError.status || 400).render("user/auth/verify-otp",{
          title:"Verify OTP",
          error: serviceError.message,
          isOtpExpired: serviceError.isExpired || false,
          layout: false,
        });
      }
  }catch(error){
    next(error)
  }
};

const resendOtp = async (req,res,next)=>{
  try{
    const email = req.session.otpEmail;
    if(!email) return res.redirect("/register")

      await authService.sendOtp(email);

      res.render("user/auth/verify-otp",{
        title: "Verify OTP",
        error: null,
        isOtpExpired: false,
        layout: false,
      })
  }catch(error){
    next(error)
  }
}

const getLogin = (req,res)=>{
  const blockedMessage = req.session.blockedMessage || null;
  const success = req.session.success || null;
  req.session.blockedMessage = null
  req.session.success = null

  res.status(200).render("user/auth/login",{
    title: "Login",
    errors: blockedMessage ? { general: blockedMessage} : {},
    formData: {},
    success,
    layout: false,
  })
}

const postLogin = async(req,res,next)=>{
  try{
    const { email, password} = req.body;

    const errors = validateLogin({ email, password});
    if(Object.keys(errors).length >0 ){
      return res.status(400).render("user/auth/login",{
        title: "Login",
        errors,
        formData: { email },
        success: null,
        layout : false,
      });
    }

    try{
      const user = await authService.loginUser(email,password);

      req.session.user = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        role: user.role,
      }

      res.redirect("/home")
    }catch(serviceError){
      if(serviceError.field === "unverified"){
        try{
          await authService.sendOtp(email);
        }catch(e){
          console.error("OTP send failed:",e)
        }
        req.session.otpEmail = email;
        req.session.fromLogin = true;
        return res.redirect("/verify-otp");
      }
      return res.status(serviceError.status || 400).render("user/auth/login",{
        title: "Login",
        errors: {[serviceError.field]: serviceError.message},
        formData:{ email},
        success: null,
        layout: false,
      });
    }
  }catch(error){
    next(error)
  }
};

const logout = (req,res)=>{
  req.session.user = null;
  res.redirect("/")
};


const getForgotPassword = (req,res)=>{
  res.status(200).render("user/auth/forgot-password",{
    title: "Forgot Password",
    error: null,
    success: null,
    layout: false,
  });
};


const postForgotPassword = async(req,res,next)=>{
  try{
    const { email } = req.body;

    try{
      await authService.forgotPassword(email);
    }catch(serviceError){
      return res.status(serviceError.status || 400).render("user/auth/forgot-password",{
        title:"Forgot Password",
        error: serviceError.message,
        success:null,
        layout: false,
      })
    }

    req.session.resetEmail = email;
    res.redirect("/verify-reset-otp")
  }catch (error){
    next(error)
  }
};


const getVerifyResetOtp = (req,res)=>{
  if(!req.session.resetEmail){
    return res.redirect("/forgot-password");
  }

  res.render("user/auth/verify-reset-otp",{
    title:"Verify OTP",
    error: null,
    isOtpExpired: false,
    layout: false,
  });
};


const postVerifyResetOtp = async (req,res,next)=>{
  try{
    const email = req.session.resetEmail;
    if(!email) return res.redirect("/forgot-password");

    const otp = [
      req.body.otp1,req.body.otp2,req.body.otp3,
      req.body.otp4,req.body.otp5,req.body.otp6,
    ].join("");

    try{
      await authService.verifyResetOtp(email,otp);
      req.session.resetVerified = true
      res.redirect("/reset-password");
    }catch (serviceError){
      return res.status(serviceError.status || 400).render("user/auth/verify-reset-otp",{
        title: "Verify OTP",
        error:serviceError.message,
        isOtpExpired: serviceError.isExpired || false,
        layout: false,
      });
    }
  }catch (error){
    next(error)
  }
};


const getResetPassword = (req,res)=>{
  if(!req.session.resetEmail || !req.session.resetVerified){
    return res.redirect("/forgot-password")
  }

  res.status(200).render("user/auth/reset-password",{
    title: "Reset Password",
    error: null,
    layout: false,
  });
};


const postResetPassword = async(req,res,next)=>{
  try{
    const email = req.session.resetEmail
    if(!email || !req.session.resetVerified){
      return res.redirect("/forgot-password");
    }

    const { newPassword, confirmPassword} = req.body;

    const errors = validateResetPassword({ newPassword, confirmPassword});
    if(Object.keys(errors).length > 0){
      return res.status(400).render("user/auth/reset-password",{
        title: "Reset Password",
        error: errors.newPassword || errors.confirmPassword,
        layout: false,
      });
    }

    await authService.resetPassword(email, newPassword)

    req.session.resetEmail = null;
    req.session.resetVerified = null;
    req.session.success = "Password updated successfully! Please login.";
    res.redirect("/login")
  }catch(error){
    next(error)
  }
};

module.exports = {
  getRegister,
  postRegister,
  getVerifyOtp,
  postVerifyOtp,
  resendOtp,
  getLogin,
  postLogin,
  logout,
  getForgotPassword,
  postForgotPassword,
  getVerifyResetOtp,
  postVerifyResetOtp,
  getResetPassword,
  postResetPassword,
};