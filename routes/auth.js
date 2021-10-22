const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/", (req, res) => {
  if (("user" in req.session)) {
    res.redirect("/projects");
  } else {
    res.render("login",{page:"login"});
  }
});

router.get("/change_role/:role", (req, res) => {
  // console.log("req.params: ", req.params);
  // console.log("res.session: ", res);
  if (("user" in req.session)) {
    if (req.session.user.roles.indexOf(req.params.role)) {
      req.session.role = req.params.role
    }
  }
  res.redirect("/")
});

module.exports = router