const router = require('express').Router();
const User = require('../model/user');
const Materiel = require('../model/materiel');
const Preparation = require('../model/preparations');
const PrepDet = require('../model/preparation_details');
const apps = require('../controller/app');
const express = require('express');
//the front End uses this to request materiels or money 
router.post('/preparations',apps.postPreparations);

//get all the materials
router.get('/materiels',async(req,res)=>{
    console.log("a7a")
    const allMateriels= await Materiel.find({})
    console.log(allMateriels)
    res.send(allMateriels)
});

// The admin sees all the preparations
router.get('/preparations',async(req,res)=>{
    const preparation=await Preparation.find({}).populate({
        path: 'preparation_details',
        populate: {
            path: 'materiels.materiel'
        }
    }).populate('chef');
    console.log("preparation")
    console.log(preparation)
    res.send(preparation)

})

//the user sees his submits
router.post('/mypreparations',async(req,res)=>{
    const user=await User.find({name:req.body.user});
    const userObj= User.findById(user[0]._id);
    const preparation= await Preparation.find({chef:user[0]._id}).populate({
        path: 'preparation_details',
        populate: {
            path: 'materiels.materiel'
        }
    })
    console.log(preparation)
    res.send(preparation)

})
//the admin accepts the preparations
router.post('/acceptPreparation',async(req,res)=>{
    const user=await User.find({name:req.body.user});
    //const userObj= User.findById(user[0]._id);
    if(!user){
        res.status(400).send("user not found")
    }
    const preparation= await Preparation.find({chef:user[0]._id})

if(!preparation){res.status(400).send("no preparation for this user")}
    Preparation.findByIdAndUpdate(preparation[0]._id,{ state: req.body.state },
    function (err, docs) {
if (err){
console.log(err)
res.status(400).send(err)
}
else{
console.log("Updated state");
}
});

res.send()



})
router.get('/h',(req,res)=>{
    res.send("you are in api/prep")
})
module.exports = router;