const router = require('express').Router();
const User = require('../model/user');
const Materiel = require('../model/materiel');
const Preparation = require('../model/preparations');
const PrepDet = require('../model/preparation_details');
module.exports.postPreparations = async(req,res)=>{
    var materiels = [];
    console.log("req.body.materiels")
    console.log(req.body.materiels)
    for (let m of req.body.materiels){
        console.log("m:")
    console.log(m)
        
        const mat = await Materiel.find({ title: m.materiel.title}  )
        if (mat.length==0){
            return res.status(400).send("must enter a valid materiel")
        }
        console.log("mat")
        console.log(mat)    //array of matching 
        if (m.quantity>mat[0].quantity){
            res.status(400).send("quantity is larger than available")

        }
        else{
            var q =mat[0].quantity-m.quantity
            await Materiel.findByIdAndUpdate(mat[0]._id,{quantity:q})
            const matObj= Materiel.findById(mat[0]._id)
            console.log("matObj ")
            console.log(matObj)

            materiels.push({materiel:mat[0]._id,quantity:q})
        }
        
    }
    console.log("materiels array")
    console.log(materiels)
    const prep_subject= req.body.subject
    const prep_meal= req.body.meal
    const prep_money= req.body.money
    const prepSchema={subject:prep_subject,
    meal:prep_meal,
    materiels:materiels,
    money:prep_money
}

    console.log("prepSchema")
    console.log(prepSchema)
    const userhasPrepared=await User.find({name:req.body.user});
    console.log("userhasPrepared")
    console.log(userhasPrepared)
    if ( userhasPrepared.length==0){
        return res.status(400).send("No user by this name")
    }
    const preparationOfUser= await Preparation.find({chef:userhasPrepared[0]._id})
    if ( preparationOfUser.length!=0){
        return res.status(400).send("chef must not submit more than 1 request until it is accepted")
    }
    const preparation = new PrepDet();
    preparation.subject=req.body.subject
    preparation.meal=req.body.meal
    preparation.money=req.body.money
    preparation.materiels=materiels
    const x=await preparation.save();
    console.log(x)
    const ta7dir = new Preparation();
    const user=req.body.user;
    const chef=await User.find ({name: user})
    
    ta7dir.preparation_details=preparation;
    ta7dir.chef=chef[0]._id
    const  t =await ta7dir.save();
    
    res.send("pending")

}