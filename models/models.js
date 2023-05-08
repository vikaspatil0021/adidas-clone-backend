import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    email:String,
    password:String,
    username:String,
    address:[]
})

const menProductSchema = mongoose.Schema({
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
    tag:String,
    wishlist:Boolean


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
    tag:String,
    wishlist:Boolean



});

const kidsProductSchema = mongoose.Schema({
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
    tag:String,
    wishlist:Boolean


});

const wishListSchema = mongoose.Schema({
        email:String,
        products:[]
});

const ordersSchema = mongoose.Schema({
    email:String,
    products:[],
    address:{}
})


const UserInfo = mongoose.model("user",userSchema);
const MenProductInfo = mongoose.model("men",menProductSchema);
const WomenProductInfo = mongoose.model("women",womenProductSchema);
const KidsProductInfo = mongoose.model("kid",kidsProductSchema);
const WishListInfo = mongoose.model("wishlist",wishListSchema);
const OrdersInfo = mongoose.model("order",ordersSchema);



export { UserInfo,
    MenProductInfo,
    WomenProductInfo,
    KidsProductInfo,
    WishListInfo,
    OrdersInfo
};