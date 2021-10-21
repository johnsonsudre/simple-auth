const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.use((req, res, next) => {
  if ("user" in req.session) {
    res.locals.user = req.session.user;
  }
  next();
});

router.get("/", (req, res) => {
  if (!("user" in req.session)) {
    res.render("login",{page:"login"});
  } else {
    res.redirect("/projects");
  }
});

router.post("/", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const isAuth = await user.checkAppUser(req.body.password);
    if (isAuth) {
      req.session.user = user;
      res.redirect("/projects");
    } else {
      res.redirect("/");
    }
  }
});

module.exports = router