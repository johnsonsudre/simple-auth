const express = require('express')
const session = require('express-session')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


const path = require('path')

const mongoURI = process.env.MONGODB || 'mongodb://localhost:27017/bitgol_users'
const port = process.env.PORT || 3000

mongoose.Promise = global.Promise
const User = require('./models/user')

const projects = require('./routes/projects')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extend:true}))
app.use(session({secret:'bitgol4d'}))
app.use(express.static('public'))


app.use('/projects', (req, res, next)=>{
  if ('user' in req.session) {
    return next()
  } else {
    res.redirect('/login')
  }
})
app.use('/projects', projects)

app.get('/', (req, res)=>{res.render("cover")})
app.get('/login', (req, res)=>{res.render("login")})

app.post('/login', async(req, res)=>{
  const user = await User.findOne({username: req.body.username})
  console.log(req.body)
  console.log("user: ", user)
  if (user) {
  const isAuth = await user.checkAppUser(req.body.password)
     if (isAuth) {
       req.session.user = user
       res.redirect('/projects')
     } else {
       res.redirect('/login')
     }
   }
})

const checkRootUser = async () => {
  const total = await User.count({username:'root'})
  if (total===0) {
    const user = new User({
      username: 'root',
      password: '123'
    })
    await user.save(()=>console.log('root user is created'))
  }
}

mongoose
  .connect(mongoURI)
  .then(()=>{
    console.log("database connected")
    checkRootUser()
    app.listen(port, ()=>{
      console.log('listen on', port)
    })
  })
  .catch(err=>console.log(err))