import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})

const userModel=mongoose.models.user || mongoose.model("user", userSchema);
//mongoose.models.user: Checks if the User model is already defined in Mongoose’s internal registry.
//mongoose.model("user", userSchema): If not defined, it creates a new model named "user" using userSchema.


export default userModel;