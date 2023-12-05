const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoute')
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')

mongoose.connect("mongodb+srv://ManishRB21:Manish%40123@cluster1.qhga3xo.mongodb.net/JWT?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then((result)=> {
    app.listen(5000)
}).catch((e) => {
    console.log("not connected");
});

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/smoothies', (req,res)=>{
    res.render('smoothies')
})

app.use(authRoutes)

app.get('/setcookies', (req,res)=>{
    res.cookie('newUser', false) 
    res.send("cookie")
})

app.get('/readcookies', (req,res)=>{
    const cookies = req.cookies
    console.log(cookies.newUser)
    res.json(cookies)
})