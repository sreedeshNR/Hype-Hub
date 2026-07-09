const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminController");
const { isAdminLogin } = require("../../middlewares/adminMiddleware");

// Dashboard
router.get("/admin/dashboard", isAdminLogin, adminController.getDashboard);

// User Management
router.get("/admin/users", isAdminLogin, adminController.getUsers);
router.post("/admin/users/block/:id", isAdminLogin, adminController.blockUser);
router.post("/admin/users/unblock/:id", isAdminLogin, adminController.unblockUser);

module.exports = router;