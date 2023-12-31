const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "email present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email");
            }
        },
        lowercase: true
    },

    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Minimum length is 6"]
    },
})

//fire a func after doc is saved to db
userSchema.post('save', (doc, next) => {
    console.log('new user created', doc)
    next()
})

//fire a func after doc is saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)   
    next()
})

//static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email') 
}

const User = new mongoose.model('user', userSchema)
module.exports = User
