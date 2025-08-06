const express=require('express');
const router=express.Router();

const {registerUser}=require("../controllers/authController");

router.post('/Signup',registerUser);

module.exports=router;