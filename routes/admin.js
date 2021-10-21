const express = require('express')
const router = express.Router()
const User = require('../models/user')

const roles = ['admin', 'normal']

router.use((req, res, next) => {
  if ("user" in req.session) {
    return next();
  } else {
    res.redirect("/");
  }
});

router.get('/',async (req,res)=>{
    const rootname=req.session.user.username
    const users = await User.find()
    res.render('admin',{
      rootname, 
      roles, 
      users: users.map(user=>user),
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