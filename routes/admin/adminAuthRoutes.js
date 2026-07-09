const express = require("express");
const router = express.Router();
const adminAuthController = require("../../controllers/admin/adminAuthController");
const { isAdminLogin, isAdminLogout } = require("../../middlewares/adminMiddleware");


router.get("/admin",(req,res)=>{
    if(req.session.admin){
        return res.redirect("/admin/dashboard")
    }

    res.redirect("/admin/login")
})

router.get("/admin/login", isAdminLogout, adminAuthController.getAdminLogin);
router.post("/admin/login", adminAuthController.postAdminLogin);
router.get("/admin/logout", isAdminLogin, adminAuthController.adminLogout);

module.exports = router;