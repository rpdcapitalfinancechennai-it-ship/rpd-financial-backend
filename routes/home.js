const express = require("express");
const Home = require("../models/Home");
const router = express.Router();
router.post('/', async(req,res)=>{
    try{
        res.json({message : "successss"});
    }
    catch(err){
        res.json(err.message);
    }
})
module.exports = router;