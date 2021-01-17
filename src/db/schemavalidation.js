require("dotenv").config()
let mongoose = require("mongoose")
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")
// let bcrypt = require("bcryptjs")

let schemaValidation = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "please enter minimum 3 value"],
        maxlength: [20, "please enter small name"]
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    gender:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default : Date.now()
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        } 
    }]
})

schemaValidation.methods.generatewebtoken = async function(){
    try{

        let token = await jwt.sign({_id: this._id.toString()}, process.env.Secret_Key)
        this.tokens = await this.tokens.concat({token: token})
        await this.save()
        return token
    }catch(err){
        console.log("there is an error please check", err)
    }
}


schemaValidation.pre("save", async function(next){
    if(this.isModified()){

        console.log(`the current password is ${this.password}`)
         this.password= await bcrypt.hash(this.password, 10)
         this.confirmpassword= await bcrypt.hash(this.password, 10)
        console.log(`the current password is ${this.password}`)
    }
    next()
})
// schemaValidation.pre("save", async function(next){
//        if(this.isModified){
//            this.password = await bcrypt.hash(this.password, 10)
//        }
// })

let registerData = new mongoose.model("Registerdata", schemaValidation)
module.exports = registerData

