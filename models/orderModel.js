const mongoose  = require("mongoose");

const schema = mongoose.Schema({
    customer_id : {type : mongoose.Schema.Types.ObjectId, required : true},
    product : {type : Object, required : true},
    qty : {type : Number, required : true},
    price : {type : Number, required : true},
    total : {type : Number, required : true},
    created_at : {type : Date, required : true},
})

module.exports = mongoose.model("order", schema);