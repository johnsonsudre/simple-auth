const express = require('express')
const router = express.Router()

router.use((req,res, next)=>{
  res.locals.page = "cover";
  next();
})

router.get('/',async (req,res)=>{
  res.render('cover')
})

module.exports = router