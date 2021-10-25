const express = require('express')
const router = express.Router()
const User = require("../models/user")

router.use((req,res, next)=>{
  res.locals.page = "login";
  next();
})


router.get('/',async (req,res)=>{
  res.render('login', { page:"login" })
})

router.post("/", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const isAuth = await user.checkAppUser(req.body.password);
    if (isAuth) {
      console.log("welcome ",user.username)
      req.session.user = user;
      req.session.role = user.roles[0];
      res.redirect("/projects");
    } else {
      res.redirect("/login");
    }
  }
});

module.exports = router