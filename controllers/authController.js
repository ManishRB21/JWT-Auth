const User = require('../model/User')

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let error = { email: '', password: '' }
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
        res.status(201).json(user);
    } catch (e) {
        const errors = handleErrors(e)
        res.status(400).json({ errors })
    }
}

module.exports.login_post = (req, res) => {
    res.send('login')
}