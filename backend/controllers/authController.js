const User= require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUp = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email : email});
        if(existingUser){
            return res.status(400).json({message : "User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser= new User({
            name : name,
            email : email,
            password : hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            {userId : newUser._id},
            process.env.JWT_SECRET,
            {expiresIn : process.env.JWT_EXPIRES_IN}
        )

        return res.status(201).json({
            message : "User created successfully",
            token : token,
            user : {
                id : newUser._id,
                name : newUser.name,
                email : newUser.email
            }
        })
    }
    catch(err){
        return res.status(500).json({message : "Server error"});
    }
}

const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user= await User.findOne({email : email});

        if(!user){
            return res.status(400).json({message : "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid credentials"});
        }

        const token = jwt.sign(
            {userId : user._id},
            process.env.JWT_SECRET,
            {expiresIn : process.env.JWT_EXPIRES_IN}
        )

        return res.status(200).json({
            message : "Login successful",
            token : token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email
            }
        })
    }
    catch(err){
        return res.status(500).json({message : "Server error"});
    }
}

module.exports = {
    signUp,
    login
}