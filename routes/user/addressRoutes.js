const express = require("express");
const router = express.Router();
const addressController = require("../../controllers/user/addressController");
const { isLogin, checkBlocked } = require("../../middlewares/authMiddleware");

router.get("/addresses", isLogin, checkBlocked, addressController.getAddresses);
router.get("/addresses/add", isLogin, checkBlocked, addressController.getAddAddress);
router.post("/addresses/add", isLogin, checkBlocked, addressController.postAddAddress);
router.get("/addresses/edit/:id", isLogin, checkBlocked, addressController.getEditAddress);
router.post("/addresses/edit/:id", isLogin, checkBlocked, addressController.postEditAddress);
router.post("/addresses/delete/:id", isLogin, checkBlocked, addressController.deleteAddress);

module.exports = router;