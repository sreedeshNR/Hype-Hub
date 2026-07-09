const express = require("express")
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("../config/passport");

const setupMiddleware = (app) => {
  // Basic
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(require("path").join(__dirname, "../public")));

  // No cache
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
  });

  // Session
  app.use(session({
    name: "user_session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
  }));

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport blocked message
app.use((req, res, next) => {
  if (req.session.messages && req.session.messages.length > 0) {
    const message = req.session.messages[0];
    if (message === "blocked") {
      req.session.blockedMessage = "Your account has been blocked. Contact support.";
    }
    req.session.messages = [];
  }
  next();
});

  // Global locals
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
};

module.exports = setupMiddleware;