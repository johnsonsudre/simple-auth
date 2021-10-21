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
  res.render('projects', {
    user: {
      username: req.session.user.username,
      roles: req.session.user.roles
    }, users: users.map(user=>user.username)
  })
})

module.exports = router