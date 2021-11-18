require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new Schema ({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY , encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema)

app.get("/",(req, res) => {

    res.render("home.ejs")

})

app.get("/login",(req, res) => {

    res.render("login.ejs")

})

app.get("/register",(req, res) => {

    res.render("register.ejs")

})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err) => {
        if (!err) {
            res.render("secrets")
        } else {
            console.log(err)
        }
    })
})

app.post("/login", (req, res) => {
    // const email = req.body.username;
    // const password = req.body.password;
    console.log(req.body.username)
    console.log(req.body.password)

    User.findOne({email: req.body.username}, function(err, docs) {
            if (err) {
                console.log(err)
            } else {
                if (docs) {
                    if (docs.password === req.body.password) {
                        res.render("secrets")
                    } else {
                        res.render("home.ejs")
                    }
                }
            }              
    })
})

app.listen(3000, () => {

    console.log("Server started on port 3000")

})