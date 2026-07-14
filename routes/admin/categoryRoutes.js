const express = require("express");
const router = express.Router();

const categoryController = require("../../controllers/admin/categoryController");
const { isAdminLogin } = require("../../middlewares/adminMiddleware");
const upload = require("../../config/multer");

router.get("/admin/categories",isAdminLogin,categoryController.getCategories)

router.get("/admin/categories/add",isAdminLogin,categoryController.getAddCategory)

router.post("/admin/categories/add",isAdminLogin,upload.single("image"),categoryController.postAddCategory)

router.get("/admin/categories/edit/:id",isAdminLogin,categoryController.getEditCategory);

router.post("/admin/categories/edit/:id",isAdminLogin,upload.single("image"),categoryController.postEditCategory)

router.post("/admin/categories/toggle/:id",isAdminLogin,categoryController.toggleCategoryStatus)

router.post("/admin/categories/delete/:id", isAdminLogin, categoryController.deleteCategory)

module.exports = router;