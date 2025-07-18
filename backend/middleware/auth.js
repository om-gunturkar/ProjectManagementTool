import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export default async function authMiddleware(req,res,next){
    //Grab The Bearer Token From Auth header
    const authHeader = req.headers?.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res
        .status(401)
        .json({success:false,message:"Not Authorized, token missing"})
    }

    const token = authHeader.split(' ')[1];
    
    //Verify And Attach User Object
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');
        if(!user){
            return res.status(401).json({success:false,message:"User Not Found"})
        }
        req.user = user;
        next();
    }catch(err){
        console.log("JWT Verification Failed",err)
        return res.status(401).json({success:false,message:"Token Invalid or Expired"})
    }
}