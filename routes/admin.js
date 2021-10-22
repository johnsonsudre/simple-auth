const express = require('express')
const router = express.Router()
const User = require('../models/user')

const roles = ['admin', 'normal']

router.use((req, res, next) => {
  if ("user" in req.session) {
    if (req.session.user.roles.indexOf('admin')>=0) {
      return next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});

router.get('/',async (req,res)=>{
  const users = await User.find()
  res.render('admin',{
    roles, 
    users: users.map(user=>{
      return { username:user.username, roles:user.roles }
    }),
    user: {
      username: req.session.user.username,
      roles: req.session.user.roles
    },
    page:"admin",
  } )
})

router.get('/userRemove',async (req,res)=>{
  res.redirect('/admin')
})

router.post('/',async (req,res)=>{
  if (req.body) {
    const user = await User.findOne({username:req.session.user.username})
    if (req.body.rootpass) { // change root pass
      if (user) { 
        user.password = req.body.rootpass
        await user.save()
      }
      res.redirect('/admin')
    }
    if (req.body.username) { // add new user
      const newuser = new User({
        username:req.body.username,
        password:req.body.password,
        roles:req.body.roles
      })
      await newuser.save(()=>{
        console.log('new user added')
        res.redirect('/admin')
      })
    }
    if (req.body.userToRemove) { // remove user
      const userToRemove = await User.findOne({username:req.body.userToRemove})
      if (userToRemove) {
        await userToRemove.remove(()=>{
          console.log('user removed')
          res.redirect('/admin')
        })
      }
    }
  }
})

module.exports = router