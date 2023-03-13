import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    email:String,
    password:String,
    username:String
})




const UserInfo = mongoose.model("user",userSchema);



export { UserInfo };