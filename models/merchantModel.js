const mongoose  = require("mongoose");

const schema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    password : {type : String, required : true},
    shop : {type : String, required : true},
    created_at : {type : Date, required : true},
    updated_at : {type : Date, required : true},
    slug : {type : String, required : true}
})

module.exports = mongoose.model("merchant", schema);