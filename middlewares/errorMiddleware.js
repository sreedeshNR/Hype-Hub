const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).render("user/500", {
    title: "Server Error",
    layout: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

module.exports = errorHandler;