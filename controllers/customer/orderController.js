const express   = require("express");

const router    = express.Router();

const moment    = require("moment");

const slugify   = require("slugify");

const mongoose  = require("mongoose");

const orderModel = require("../../models/orderModel");

const productModel = require("../../models/productModel");

const customerModel = require("../../models/customerModel");

const tokenHelper = require("../../helpers/token");

router.post("/", (req, res) => {
    tokenHelper.verifyToken(req.headers.token, (callback) => {
        if(callback == "valid") {
            let customerId = req.body.customerId;
            let productId = req.body.productId;
            let qty = req.body.qty;
            let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
            productModel.findById(productId)
            .exec()
            .then(results => {
                if(results) {
                    let price = results.price;
                    let total = qty * price;
                    const order = new orderModel({
                        customer_id: mongoose.Types.ObjectId(customerId),
                        product : results,
                        qty : qty,
                        price : price,
                        total : total,
                        created_at : createdAt,
                    })
                    order.save()
                    .then(results => {
                        customerModel.findById(customerId)
                        .exec()
                        .then(results => {
                            let point = [20,40];
                            let randomPoint = point[Math.floor(Math.random()*point.length)];
                            let poin = parseInt(results.poin) + parseInt(randomPoint);
                            let requestBody = {
                                poin : poin
                            }
                            customerModel.updateOne({"_id" : customerId}, {$set : requestBody})
                            .exec()
                            .then(results => {
                                res.status(200).json({
                                    status : true,
                                    data : poin
                                })
                            })
                            .catch(error => {
                                res.status(400).json({
                                    status : false,
                                    message : error
                                })
                            })
                        })
                        .catch(error => {
                            res.status(400).json({
                                status : false,
                                message : error
                            })
                        })
                    })
                    .catch(error => {
                        res.status(400).json({
                            status : false,
                            message : error
                        })
                    })
                } else {
                    res.status(404).json({
                        status : false,
                        message : "product not found"
                    })
                }
            })
            .catch(error => {
                res.status(400).json({
                    status : false,
                    message : error
                })
            })
        } else {
            res.status(400).json({
                status : false,
                message : callback
            })
        }
    })
})

router.get("/:id", (req, res) => {
    tokenHelper.verifyTokenById(req.headers.token, req.params.id, (callback) => {
        if(callback == "valid") {
            let customerId = req.params.id;
            orderModel.aggregate([{$match:{"customer_id" : mongoose.Types.ObjectId(customerId)}},{$lookup:{from:"merchants",localField:"product.merchant_id",foreignField:"_id",as:"merchant"}},{$sort:{"created_at":-1}}])
            // orderModel.find({"product.merchant_id":mongoose.Types.ObjectId(merchantId)})
            .exec()
            .then(results => {
                res.status(200).json({
                    status : true,
                    data : results
                })
            })
            .catch(error => {
                res.status(400).json({
                    status : false,
                    message : error
                })
            })
        } else {
            res.status(400).json({
                status : false,
                message : callback
            })
        }
    })
})

module.exports = router;