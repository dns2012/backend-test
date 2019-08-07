const express   = require("express");

const router    = express.Router();

const moment    = require("moment");

const slugify   = require("slugify");

const bcrypt    = require("bcrypt");

const merchantModel = require("../../models/merchantModel");

const customerModel = require("../../models/customerModel");

const tokenHelper     = require("../../helpers/token");

router.post("/register", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 10);
    let shop = req.body.shop;
    let created_at = moment().format("YYYY-MM-DD HH:mm:ss");
    let updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
    let slug = slugify(name, {lower : true});
    merchantModel.find({"email" : email})
    .exec()
    .then(results => {
        if(results.length > 0) {
            res.status(400).json({
                status : false,
                message : "merchant already registered"
            })
        } else {
            customerModel.find({"email" : email})
            .exec()
            .then(results => {
                if(results.length > 0) {
                    res.status(400).json({
                        status : false,
                        message : "email already registered as customer"
                    })
                } else {
                    const merchant = new merchantModel({
                        name : name,
                        email : email,
                        password : password,
                        shop : shop,
                        created_at : created_at,
                        updated_at : updated_at,
                        slug : slug
                    })
                    merchant.save()
                    .then(results => {
                        res.status(201).json({
                            status : true,
                            message : "success",
                            data : results
                        })
                    })
                    .catch(error => {
                        res.status(400).json({
                            status : false,
                            message : error
                        })
                    })
                }
            })
            .catch(error => {
                res.status(400).json({
                    status : false,
                    message : error
                })
            })
        }
    })
    .catch(error => {
        res.status(400).json({
            status : false,
            message : error
        })
    })
})

router.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    merchantModel.find({"email" : email})
    .exec()
    .then(results => {
        if(results.length > 0) {
            if(bcrypt.compareSync(password, results[0].password)) {
                let payload = {
                    id : results[0]._id,
                    email : results[0].email
                }
                let token = tokenHelper.getToken(payload);
                res.status(200).json({
                    status : true,
                    data : results,
                    token : token
                })
            } else {
                res.status(400).json({
                    status : false,
                    message : "wrong password",
                })
            }
        } else {
            res.status(404).json({
                status : false,
                message : "merchant not registered"
            })
        }
    })
    .catch(error => {
        res.status(400).json({
            status : false,
            message : error
        })
    })
})

module.exports = router