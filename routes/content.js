const express = require('express')
const router = express.Router()


router.use((req,res, next)=>{
  res.locals.page = "content";
  next();
})

router.get('/',async (req,res)=>{
  res.render('content', { page:"content" })
})

module.exports = router