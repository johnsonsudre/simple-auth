const express = require('express')
const router = express.Router()

router.get('/',async (req,res)=>{
  res.render('cover', {page:"cover"})
})

module.exports = router