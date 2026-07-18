const express = require("express");
const router = express.Router();

const brandController = require("../../controllers/admin/brandController");
const { isAdminLogin } = require("../../middlewares/adminMiddleware");
const upload = require("../../config/multer");

router.get("/admin/brands", isAdminLogin, brandController.getBrands);

router.get("/admin/brands/add", isAdminLogin, brandController.getAddBrand);
router.post("/admin/brands/add", isAdminLogin, upload.single("image"), brandController.postAddBrand);

router.get("/admin/brands/edit/:id", isAdminLogin, brandController.getEditBrand);
router.post("/admin/brands/edit/:id", isAdminLogin, upload.single("image"), brandController.postEditBrand);

router.post("/admin/brands/toggle/:id", isAdminLogin, brandController.toggleBrandStatus);

router.post("/admin/brands/delete/:id", isAdminLogin, brandController.deleteBrand);

module.exports = router;