const express = require('express')
const router = express.Router()
const User = require("../models/user")

router.use((req, res, next) => {
  if ("user" in req.session) {
    return next();
  } else {
    res.redirect("/");
  }
});

router.get('/', async (req,res)=>{
  const users = await User.find()
  res.render('projects', {user: req.session.user.username, users: users.map(user=>user.username)})
})

module.exports = router