const adminService = require("../../services/admin/adminService")
const User = require("../../models/User");


// GET /admin/dashboard

const getDashboard = async (req, res,next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "USER",isVerified: true });

    res.render("admin/dashboard", {
      title: "Dashboard",
      admin: req.session.admin,
      totalUsers,
      layout: false,
    });

  } catch (error) {
    next(error)

  }
};


// GET /admin/users

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = 5;
    

    const { users, totalUsers, totalPages} = await adminService.getAllUsers({
      search,page,limit,
    });

    // Get and clear success message
    const success = req.session.adminSuccess || null;
    req.session.adminSuccess = null;

    res.status(200).render("admin/users", {
      title: "User Management",
      admin: req.session.admin,
      users,
      search,
      currentPage: page,
      totalPages,
      totalUsers,
      success,
      layout: false,
    });

  } catch (error) {
    next(error);
  }
};


// POST /admin/users/block/:id

const blockUser = async (req, res, next) => {
  try {
    const user = await adminService.blockUser(req.params.id);

    req.session.adminSuccess = `${user.fullName} has been blocked successfully.`;
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};


// POST /admin/users/unblock/:id

const unblockUser = async (req, res, next) => {
  try {
    const user = await adminService.unblockUser(req.params.id)
    req.session.adminSuccess = `${user.fullName} has been unblocked successfully.`;
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  blockUser,
  unblockUser,
};