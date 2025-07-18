import mongoose from "mongoose";

export const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://dbUser:projectManager24@mycluster.abmdopg.mongodb.net/FocusFlow')
    .then(()=>{
        console.log("DB Connected")
    })
    
}