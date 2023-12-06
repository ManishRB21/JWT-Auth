const User = require('../model/User')
const jwt = require('jsonwebtoken')
//handle errors

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let error = { email: '', password: '' }

    //incorrect email
    if(err.message==='incorrect email'){
        error.email= 'that email is not is not registered'
    }
    //incorrect password
    if(err.message==='incorrect password'){
        error.password= 'that password is not is not registered'
    }
    //duplicate error code
    if (err.code === 11000) {
        error.email = 'that email is already registered'
        return error
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message
        })
    }

    return error;
}

const maxAge = 3*24*60*60;
//create token
const createToken = (id) =>{
    return jwt.sign({id}, 'manish behera', {
        expiresIn:maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id)
        console.log(token)
        res.cookie('jwt', token, {
            httpOnly : true, maxAge : maxAge*1000
        })
        res.status(201).json({user : user._id});
    } catch (e) {
        const errors = handleErrors(e)
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        console.log(token)
        res.cookie('jwt', token, {
            httpOnly : true, maxAge : maxAge*1000
        })
        res.status(200).json({user: user._id})
    } catch (e) {
        const errors = handleErrors(e)
        res.status(400).json({errors})
    }
}