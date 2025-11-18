const mongoose = require("mongoose");
const homeSchema = new mongoose.Schema({
    userName : { type : String },
    phoneNo : { type : Number },
    email : { type : String },
    msg : { type : String}
}, {
    collection : "home"
})
module.exports = mongoose.model("home",homeSchema);