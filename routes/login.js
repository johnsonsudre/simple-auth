const express = require('express')
const router = express.Router()
const User = require("../models/user")

router.get('/',async (req,res)=>{
  res.render('login', { page:"login" })
})

router.post("/", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  console.log(req.body)
  if (user) {
    console.log("user found")
    const isAuth = await user.checkAppUser(req.body.password);
    if (isAuth) {
      console.log("user authenticated")
      req.session.user = user;
      req.session.role = user.roles[0];
      res.redirect("/projects");
    } else {
      res.redirect("/login");
    }
  }
});

module.exports = router