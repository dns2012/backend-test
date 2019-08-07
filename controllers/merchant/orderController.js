const express   = require("express");

const router    = express.Router();

const moment    = require("moment");

const slugify   = require("slugify");

const mongoose  = require("mongoose");

const orderModel = require("../../models/orderModel");

const tokenHelper = require("../../helpers/token");

router.get("/merchant/:id", (req, res) => {
    tokenHelper.verifyTokenById(req.headers.token, req.params.id, (callback) => {
        if(callback == "valid") {
            let merchantId = req.params.id;
            orderModel.aggregate([{$match:{"product.merchant_id" : mongoose.Types.ObjectId(merchantId)}},{$lookup:{from:"customers",localField:"customer_id",foreignField:"_id",as:"customer"}},{$sort:{"created_at":-1}}])
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