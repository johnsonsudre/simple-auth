const express = require('express')
const router = express.Router()
const User = require("../models/user")


router.use((req, res, next) => {
  res.locals.page = "projects";
  if ("user" in req.session) {
    return next();
  } else {
    res.redirect("/login");
  }
});

router.get('/', async (req,res)=>{
  const users = await User.find()
  res.render('projects', {
    users: users.map(user=>{
      return { username:user.username, roles:user.roles }
    }),    
    user: {
      username: req.session.user.username,
      roles: req.session.user.roles
    },
    page:"projects" ,
  })
})

module.exports = router