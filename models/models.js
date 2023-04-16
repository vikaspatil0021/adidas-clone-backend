import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    email:String,
    password:String,
    username:String
})

const productSchema = mongoose.Schema({
    colors:{
        c1:{

            
            img1:String,
            img2:String,
            img3:String,
            img4:String,
        },
        c2:{
            img1:String,
            img2:String,
            img3:String,
            img4:String,
        }
    },
    productId:String,
    name:String,
    priceTag:String,
    description:String,
    category:String,
    tag:String


})

const womenProductSchema = mongoose.Schema({
    colors:{
        c1:{

            
            img1:String,
            img2:String,
            img3:String,
            img4:String,
        },
        c2:{
            img1:String,
            img2:String,
            img3:String,
            img4:String,
        }
    },
    productId:String,
    name:String,
    priceTag:String,
    description:String,
    category:String,
    tag:String


})


const UserInfo = mongoose.model("user",userSchema);
const ProductInfo = mongoose.model("product",productSchema);
const WomenProductInfo = mongoose.model("women",womenProductSchema);



export { UserInfo,ProductInfo,WomenProductInfo };