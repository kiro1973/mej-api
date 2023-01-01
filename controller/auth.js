const router = require('express').Router();
const User = require('../model/user');
const validation = require('../validation');
const bcryptjs=require('bcryptjs')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
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

module.exports.register = async (req, res) => {
    const { error } = validation.registerValidation(req.body);
    if (error) {
         res.status(400)
            return res.send({"eroor":error.details[0].message});
    }

    // checking if user already in db
    const emailExist=await User.findOne({email:req.body.email});

    if(emailExist) return res.status(400).send({"error":'Email already exists'})
    const usernameExist=await User.findOne({name:req.body.name});

    if(usernameExist) return res.status(400).send({"error":'username already exists'})

    //hash passwords
const salt= await bcryptjs.genSalt(10);
const hashedPassword=await bcryptjs.hash(req.body.password,salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser=await user.save();
        res.send({"name": savedUser.name,"type":savedUser.userType} );
    }catch(err){
        res.status(400).send(err);
    }

}
module.exports.login = async (req,res)=>{
    console.log("in login")
    const { error } = validation.loginValidation(req.body);
    if (error) {
         res.status(400)
            return res.send(error.details[0].message);
    }
    const user=await User.findOne({name:req.body.name});
    // No user with this username
    if(! user) return res.status(401).send({"error":'user name does not exist'})
    
    //check password
    const validPass=await bcryptjs.compare(req.body.password,user.password);
    if (! validPass) return res.status(402).send({"error":'Invalid password'});
    //let him in
    res.send({"name":user.name,"type":user.userType})

}