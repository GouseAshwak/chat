const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema(
  {
    name: {type: String,required: true},
    
    User_id:{type: String,default:null},

    email: {
      type: String,
      validate: {validator: validator.isEmail,message: 'Email is not valid'},
      lowercase: true,
      unique: true,
      required: true
    },

    password: {
      type: String,required: true,select: false
    },

    otp: {type:String},

    expiry_time:{type:Date},

    role: {
      type: String,enum: ['user', 'admin'],
      default: 'user'
    },

    lat: {type:String, default:null},

    long: {type:String, default:null},

    profile_info: {
      type:Object, default:null
    },

    settings:{
      type:Object
    },

    About_Me: {type:String, default: "A Pinch of Personality "},

    followers:[{
      myFollower:{type:ObjectId,ref:"User"},
     }],

    following:[{
      imFollowing:{type:ObjectId,ref:"User"},
     }],

     is_following: {
      type: Boolean,
      default: null
    },

    is_followed: {
      type: Boolean,
      default: null
    },

    verification: {type: String},

    is_verified: {
      type: Boolean,
      default: false
    },

    is_profileSetup: {
      type: Boolean,
      default: false
    }

  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    user.password = newHash
    return next()
  })
}

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(user, salt, next)
  })
}

UserSchema.pre('save', function (next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}
UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)
