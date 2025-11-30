const User= require("../models/user")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


//generate the token jwt

const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRECT,{expiresIn:"7d"})
}


//@desc Register a new user
//@route Post the /api/auth/register
//@access public
const registerUser=async(req,res)=>{
    try{

    }catch(err){
        res.status(500).json({message:"server error",error:error.message});
    }
}


//@desc login a user
//@route post the /api/auth /register
//@access public
const loginUser=async(req,res)=>{
    try{

    }catch(err){
        res.status(500).json({message:"server error",error:error.message});
    }
}

//@desc get profile user
//@route /get/api/auth/profile
//@access private (requires jwt)
const getUserProfile=async(req,res)=>{
    try{

    }catch(err){
        res.status(500).json({message:"server error",error:error.message});
    }
}


//@desc update user profile
//@route put/api/auth/profile
//@access private (requirebjwt)

const UpdateUserProfile=async(req,res)=>{
    try{

    }catch(err){
        res.status(500).json({message:"server error",error:error.message});
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    UpdateUserProfile
};