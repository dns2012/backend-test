const express   = require("express");

const app       = express();

const port      = process.env.PORT || 3000;

app.listen(port);

const morgan    = require("morgan");

const bodyParser = require("body-parser");

const mongoose  = require("mongoose");

require("dotenv").config();

// CONNECT MONGODB
mongoose.connect(process.env.MONGODB_CREDENTIAL,{useNewUrlParser: true});

// ROUTER
const authMerchant = require("./controllers/merchant/authController");
const productMerchant = require("./controllers/merchant/productController");
const orderMerchant = require("./controllers/merchant/orderController");

const authCustomer = require("./controllers/customer/authController");
const productCustomer = require("./controllers/customer/productController");
const orderCustomer = require("./controllers/customer/orderController");

// CROSS ORIGIN
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
        return res.status(200).json();
    }
    next();
})

// BODY PARSER 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// MORGAN (FOR LOGING)
app.use(morgan("dev"));

// ROUTES
app.use("/merchant/auth", authMerchant);
app.use("/merchant/product", productMerchant);
app.use("/merchant/order", orderMerchant);

app.use("/customer/auth", authCustomer);
app.use("/customer/product", productCustomer);
app.use("/customer/order", orderCustomer);


// PUBLIC STATIC DIRECTORY
// app.use(express.static(process.env.PWD + "/public"))


app.get("/", (req, res, next) => {
    res.send("BACKEND TEST");
})