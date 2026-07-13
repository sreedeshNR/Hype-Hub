const express = require("express");
const router = express.Router();

const categoryController = require("../../controllers/admin/categoryController");
const { isAdminLogin } = require("../../middlewares/adminMiddleware");
const upload = require("../../config/multer");

router.get("/admin/categories",isAdminLogin,categoryController.getCategories)

router.get("/admin/categories/add",isAdminLogin,categoryController.getAddCategory)

router.post("/admin/categories/add",isAdminLogin,upload.single("image"),categoryController.postAddCategory)

module.exports = router;