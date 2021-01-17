const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/practiceRegistration", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("mongodb connected successfully")
}).catch((err)=>{
    console.log("there is an error mongodb connection", err)
})