
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const setupMiddleware = require("./middlewares/setupMiddleware");

connectDB();

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// All middleware in one place
setupMiddleware(app);

// Root Route
app.get("/", (req, res) => {
  res.render("user/landing", {
    title: "HypeHub - Own The Culture",
    user: req.session.user || null,
  });
});

// Routes
const authRoutes = require("./routes/user/authRoutes");
const homeRoutes = require("./routes/user/homeRoutes");
const profileRoutes = require("./routes/user/profileRoutes");
const addressRoutes = require("./routes/user/addressRoutes");
const adminAuthRoutes = require("./routes/admin/adminAuthRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const categoryRoutes = require("./routes/admin/categoryRoutes")
const brandRoutes = require("./routes/admin/brandRoutes")
const productRoutes = require("./routes/admin/productRoutes")
const userProductRoutes = require("./routes/user/productRoutes")
const cartRoutes = require("./routes/user/cartRoutes")

const errorHandler = require("./middlewares/errorMiddleware");

app.use("/", homeRoutes);

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", addressRoutes);

app.use("/", adminAuthRoutes);
app.use("/", adminRoutes);

app.use("/", categoryRoutes);
app.use("/", brandRoutes);
app.use("/", productRoutes);

app.use("/", userProductRoutes)
app.use("/", cartRoutes);

app.use(errorHandler)


// 404
app.use((req, res) => {
  res.status(404).render("user/404", { layout: false });
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});