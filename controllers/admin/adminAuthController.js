const adminAuthService = require("../../services/admin/adminAuthService")

// GET /admin/login
const getAdminLogin = (req, res) => {
  res.render("admin/auth/login", {
    title: "Admin Login",
    error: null,
    layout: false,
  });
};

// POST /admin/login
const postAdminLogin = async (req, res,next) => {
  try{
    const { email, password} = req.body;

    try{
      const admin = await adminAuthService.loginAdmin(email, password);

      req.session.admin = {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      }

      res.redirect("/admin/dashboard")
    }catch (serviceError){
      return res.status(serviceError.status || 400).render("admin/auth/login",{
        title:"Admin login",
        error: serviceError.message,
        layout: false,
      })
    }
  }catch (error){
    next(error)
  }
};

// GET /admin/logout
const adminLogout = (req, res) => {
  req.session.admin = null;
  res.redirect("/admin/login");
};

module.exports = { getAdminLogin, postAdminLogin, adminLogout };