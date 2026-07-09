const User = require("../models/User");

const isLogin = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/");
};

const isLogout = (req, res, next) => {
  if (!req.session.user) return next();
  res.redirect("/home");
};

const checkBlocked = async (req, res, next) => {
  try {
    if (!req.session.user) return next();

    const user = await User.findById(req.session.user._id);

    if (!user || user.isBlocked) {
      // Clear user session
      req.session.user = null;
      req.session.blockedMessage = "Your account has been blocked by admin. Contact support.";
      return res.redirect("/");
    }

    next();
  } catch (error) {
    console.error("Check blocked error:", error);
    next();
  }
};

module.exports = { isLogin, isLogout, checkBlocked };