const mongoose  = require("mongoose");

const schema = mongoose.Schema({
    merchant_id : {type : mongoose.Schema.Types.ObjectId, required : true},
    name : {type : String, required : true},
    description : {type : String, required : true},
    price : {type : Number, required : true},
    created_at : {type : Date, required : true},
    updated_at : {type : Date, required : true},
    slug : {type : String, required : true}
})

module.exports = mongoose.model("product", schema);