const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser=async (req,res)=>{
    try{
        const {username,password}=req.body;
        if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
}

        const find=await User.findOne({username});
        if(find){
            return res.status(400).json({message:"user already exist try another username"});
        }
        //password hash karo
        const hashedpassword=await bcrypt.hash(password,10);
        //nya user bnado
        console.log("Creating new user with username:", username);

        const newUser=await User.create({
            username,
            password:hashedpassword
        });
        //lets generate the token
        const token=jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'},
        )
        res.status(201).json({
            user:{
                id:newUser._id,
                username:newUser.username,

            },
            token
        })
    }catch (err) {
    console.error('Registration Error:', err.message);
     console.error('Registration Error:', err);  
    res.status(500).json({ message: 'Server error' });
}
}
//ab login route

module.exports={registerUser};