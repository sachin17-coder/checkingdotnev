require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const port = process.env.PORT || 8000



// Paths For website

require("../src/conn")
let registerData = require("../src/db/schemavalidation")
let public_path = path.join(__dirname, "../public")
let views_path = path.join(__dirname, "../templates/views")
let partials_path = path.join(__dirname, "../templates/partials")

app.use(express.static(public_path))
app.set("view engine", "hbs")
app.set("views", views_path)
hbs.registerPartials(partials_path)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
console.log(process.env.SECRET_KEY)
app.get("/", (req, res) => {
    // res.send("home page")
    res.render("index")
})

app.post("/registration", async (req, res) => {
    // let namee = await req.body.name
    // console.log(namee)
    try {
        let password = req.body.password
        let confirmpassword = req.body.confirmpassword

        if (password === confirmpassword) {

            let register = new registerData({
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            console.log("the success part " + register)
              let token = await register.generatewebtoken()
              console.log(token)

            let saveData = await register.save()
            console.log(saveData)
            res.render("login")
        } else {
            res.send("please check password and try again")
        }
    }
    catch (err) {
        res.render("registrationerror")
    }

})
app.get("/registration", (req, res) => {
    res.render("registration")
})

app.post("/login", async (req, res) => {
    try {

        let email = req.body.email

        let password = req.body.password

        let findEmail = await registerData.findOne({ email: email })
        let isMatch = await bcrypt.compare(password, findEmail.password)
        let token = await findEmail.generatewebtoken()
        console.log(token)
        if (isMatch) {
            res.render("index")
        }
        else {
            res.send("please check password")
        }



    } catch (err) {
        res.send("the password is not matching try again")
    }
})
app.get("/login", (req, res) => {
    res.render("login")
})



app.listen(port, () => {
    console.log("port started successfully on port number", port)
})