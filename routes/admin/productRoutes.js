const express = require("express")
const router = express.Router()

const productController = require("../../controllers/admin/productController")
const { isAdminLogin} = require("../../middlewares/adminMiddleware")
const upload = require("../../config/multer")

router.get("/admin/products",isAdminLogin, productController.getProducts)


router.get("/admin/products/add", isAdminLogin, productController.getAddProduct)
router.post("/admin/products/add", isAdminLogin,upload.array("images",3), productController.postAddProduct);

router.get("/admin/products/toggle-status/:id",isAdminLogin, productController.toggleProductStatus)

router.get("/admin/products/edit/:id",isAdminLogin, productController.getEditProduct)
router.post("/admin/products/edit/:id", isAdminLogin, upload.array("images", 3), productController.postEditProduct);

router.get("/admin/products/delete/:id", isAdminLogin, productController.deleteProduct)

module.exports = router;