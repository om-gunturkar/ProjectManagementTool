import User from "../model/userModel.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const TOKEN_EXPIRES='24h';

const createToken=(userId)=>jwt.sign({id:userId}, JWT_SECRET, {expiresIn:TOKEN_EXPIRES})

// .sign() method is used to create (sign) a new JSON Web Token (JWT) using a payload, a secret key, and optional settings like expiration.



//REGISTER FUNCTION

export async function registerUser(req,res){
    const {name,email,password} = req.body;

    // To check if the fields are filled properly
    if(!name || !email || !password){
        return res.status(400).json({success: false, message:"All Fields Are Required"})
    }
    if(!validator.isEmail(email)){ //will check if email IS email
        return res.status(400).json({success:false,message:"Invalid Email"})
    }
    if(password.length<8){
        return res.status(400).json({success:false,message:"Password must be at least 8 characters"})
    }

    // TO Check if user Exists
    try{
        if(await User.findOne({email})){
            return res.status(409).json({success:false,message:"User Already Exists"})
        }
        const hashed= await bcrypt.hash(password,10); // 10 is salt value (how many hashing algo is applied) , more the number more the security but less the speed
        const user = await User.create({name,email,password:hashed});
        const token=createToken(user._id);

        res.status(201).json({success:true,token,user:{id:user._id,name:user.name,email:user.email}})
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,message:'Server Error'})
    } 
}

//LOGIN Function
export async function loginUser(req,res){
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({success: false, message:"Email And Password Are Required"})
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({success:false, message:"Invalid Credentials"})
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(401).json({success:false,message:"Invalid Credentials"})
        }
        const token = createToken(user._id);
        res.json({success:true,token,user:{id:user._id, name:user.name,email:user.email}});

    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,message:'Server Error'})
    }
}

// GET CURRENT USER
export async function getCurrentUser(req,res){
    try{
        const user=await User.findById(req.user.id).select("name email")
        if(!user){
            return res.status(400).json({success:false,message:"User Not Found"})
        }
        res.json({success:true,user})
    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message:'Server Error'})
    }
}

//UPDATE USER PROFILE

export async function updateProfile(req,res){
    const {name,email} =req.body;

    if(!name || !email || !validator){
        return res.status(400).json({success:false,message:"Valid name and Email required"})
    }

    try{
        const exists= await User.findOne({email, _id:{$ne:req.user.id}});
        if(exists){
            return res.status(409).json({success:false,message:"email already used by another account"})
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {name,email},
            {new:true,runValidators:true, select:"name email"}
        )
        res.json({success:true,user})
    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message:'Server Error'})
    }
}

//Change Password Function

export async function updatePassword(req,res){
    const {currentPassword,newPassword} = req.body;
    if(!currentPassword || !newPassword || newPassword.length<8){
        return res.json(400).json({success:false,message:"Password invalid or too Short"})
    }
    try{
        const user = await User.findById(req.user.id).select("password")
        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"})
        }
        const match = await bcrypt.compare(currentPassword,user.password);
        if(!match){
            return res.status(401).json({success:false,message:"current password invalid"})
        }
        user.password=await bcrypt.hash(newPassword,10);
        await user.save();
        res.json({success:true,message:"password changed"})
    }catch(err){
        console.log(err);
        res.json({success:false,message:'Server Error'})
    }
}