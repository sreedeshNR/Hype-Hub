const isAdminLogin = (req, res, next) => {
  if (req.session.admin) return next();
  res.redirect("/admin/login");
};

const isAdminLogout = (req, res, next) => {
  if (!req.session.admin) return next();
  res.redirect("/admin/dashboard");
};

module.exports = { isAdminLogin, isAdminLogout };