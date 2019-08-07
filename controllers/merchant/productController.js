const express   = require("express");

const router    = express.Router();

const moment    = require("moment");

const slugify   = require("slugify");

const mongoose  = require("mongoose");

const productModel = require("../../models/productModel");

const tokenHelper = require("../../helpers/token");

router.post("/", (req, res) => {
    tokenHelper.verifyTokenById(req.headers.token, req.body.merchantId, (callback) => {
        if(callback == "valid") {
            let merchantId = req.body.merchantId;
            let name = req.body.name;
            let description = req.body.description;
            let price = req.body.price;
            let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
            let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
            let slug = slugify(name, {lower : true});
            const product = new productModel({
                merchant_id : mongoose.Types.ObjectId(merchantId),
                name : name,
                description : description,
                price : price,
                created_at : createdAt,
                updated_at : updatedAt,
                slug : slug
            })
            product.save()
            .then(results => {
                res.status(201).json({
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

router.get("/merchant/:id", (req, res) => {
    tokenHelper.verifyTokenById(req.headers.token, req.params.id, (callback) => {
        if(callback == "valid") {
            let merchantId = req.params.id;
            productModel.find({"merchant_id":merchantId})
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

router.get("/:id", (req, res) => {
    tokenHelper.verifyToken(req.headers.token, (callback) => {
        if(callback == "valid") {
            let productId = req.params.id;
            productModel.findById(productId)
            .exec()
            .then(results => {
                if(results) {
                    res.status(200).json({
                        status : true,
                        data : results
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

router.put("/:id", (req, res) => {
    tokenHelper.verifyTokenById(req.headers.token, req.body.merchantId, (callback) => {
        if(callback == "valid") {
            let productId = req.params.id;
            let requestBody = req.body;
            productModel.updateOne({_id : productId}, {$set : requestBody})
            .exec()
            .then(results => {
                if(requestBody.name) {
                    productModel.updateOne({_id : productId}, {$set : {"slug" : slugify(requestBody.name, {lower : true})}})
                    .exec();
                }
                res.status(200).json({
                    status : true,
                    message : "success"
                });
            })
            .catch(error => {
                res.status(400).json({
                    status : false,
                    message : error
                });
            })
            
        } else {
            res.status(400).json({
                status : false,
                message : callback
            })
        }
    })
})

router.delete("/:id", (req, res) => {
    tokenHelper.verifyTokenById(req.headers.token, req.query.merchantId, (callback) => {
        if(callback == "valid") {
            let productId = req.params.id;
            productModel.remove({_id : productId})
            .exec()
            .then(results => {
                res.status(200).json({
                    status : true,
                    message : "success"
                });
            })
            .catch(error => {
                res.status(400).json({
                    status : false,
                    message : error
                });
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