const express   = require("express");

const router    = express.Router();

const moment    = require("moment");

const slugify   = require("slugify");

const mongoose  = require("mongoose");

const productModel = require("../../models/productModel");

const tokenHelper = require("../../helpers/token");

router.get("/", (req, res) => {
    tokenHelper.verifyToken(req.headers.token, (callback) => {
        if(callback == "valid") {
            productModel.find()
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

router.get("/merchant/:id", (req, res) => {
    tokenHelper.verifyToken(req.headers.token, (callback) => {
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

module.exports = router;