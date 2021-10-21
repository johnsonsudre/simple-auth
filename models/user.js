const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  }
)

UserSchema.pre('save', function(next) {
  console.log(this)
  if (!this.isModified('password')) {
    console.log('same pass')
    return next()
  }
  bcrypt.genSalt(async (err,salt)=>{
    await bcrypt.hash(this.password,salt,(err,hash)=>{
      this.password = hash
      next()
    })
  })
})

UserSchema.methods.checkAppUser = function(password) {
  return new Promise((resolve, reject)=>{
    bcrypt.compare(password, this.password, (err, isMatch)=>{
      if (err) {
        reject(err)
      } else {
        if (isMatch) {
          resolve(isMatch)
        }
      }
    })
  })
}

const User = mongoose.model('User', UserSchema)

module.exports = User