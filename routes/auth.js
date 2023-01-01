const router = require('express').Router();
const User = require('../model/user');
const validation = require('../validation');
const bcryptjs=require('bcryptjs')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const users = require('../controller/auth');
//VALIDTION
const Joi = require('@hapi/joi');


const schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(6)
        .required(),

    password: Joi.string()
        .min(6)
        .required()
                    ,

    email: Joi.string()
        .email()
        .required()
})



router.post('/register',users.register);
router.post('/login',users.login)

module.exports = router;