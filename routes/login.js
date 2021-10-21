const express = require("express");
const session = require("express-session");
const User = require("../models/user")

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find()
  res.render("login", { 
    page: "login",
    users: users.map(user=>user),
    user: {
      username: req.session.user.username,
      roles: req.session.user.roles
    } });
});
