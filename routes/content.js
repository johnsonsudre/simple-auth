const express = require('express')
const router = express.Router()

router.get('/',async (req,res)=>{
  res.render('content', { page:"content" })
})

module.exports = router