const express = require("express");
const router = express.Router();
const { isLogin, checkBlocked } = require("../../middlewares/authMiddleware");

// Home page - login needed
router.get("/home", isLogin, checkBlocked, (req, res) => {
  res.render("user/home", {
    title: "Home - HypeHub",
    user: req.session.user,
  });
});

module.exports = router;
