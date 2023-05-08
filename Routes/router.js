import express from 'express';
import bcrypt from "bcrypt";
import Jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();

import { UserInfo, WomenProductInfo, MenProductInfo, KidsProductInfo, WishListInfo, OrdersInfo } from '../models/models.js';

const router = express.Router()


const ensureToken = (req, res, next) => {
    const bHeader = req.headers["authorization"];
    if (typeof bHeader != 'undefined') {
        const bToken = (bHeader.split(' '))[1];
        req.token = bToken;

        next();
    } else {
        res.status(403).json({ msg: "Invalid Token" });
    }
}

// verifying the token
const verifyToken = (token) => {
    return Jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, data) => {
        if (err) {
            return { err: err.message };
        } else {
            return data;
        }
    })
}


router.post("/register", async (req, res) => {

    const { email, password } = req.body;

    try {
        const existingUser = await UserInfo.findOne({ email: email });
        if (existingUser) {
            return res.status(200).json({ error: "Looks like you already have an account. Log in!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await UserInfo.create({
            email: email,
            password: hashPassword
        })
        const token = Jwt.sign({ email: user.email, id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({ token: token })

    } catch (error) {
        console.log(error.message);

    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await UserInfo.findOne({ email: email });
    if (!existingUser) {
        return res.status(200).json({ message: "user doesnot exists " });
    }


    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
        return res.json({ message: "Wrong password" });
    }
    const token = Jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({ token: token })



})
router.post('/checkUser', async (req, res) => {
    const { email } = req.body;
    const existingUser = await UserInfo.findOne({ email: email });
    if (existingUser) {
        return res.status(200).json({ user: "userExists" });
    } else {
        return res.status(200).json({ error: "noUserExists" });

    }

})

router.post('/matchPassword', ensureToken, async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await UserInfo.findOne({ email: email });
    if (verifyToken(req.token)) {

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            res.status(200).json('bad')
        } else {

            res.status(200).json("good")
        }
    } else {
        res.status(403).json("Invalid Token")
    }


})

router.post('/deleteAccount', ensureToken, async (req, res) => {
    const { email } = req.body;
    if (verifyToken(req.token)) {
        await UserInfo.deleteOne({ email: email });
        res.status(200).json("deleted")

    } else {
        res.status(403).json('Invalid Token')

    }



})

router.post('/changePassword', ensureToken, async (req, res) => {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    if (verifyToken(req.token)) {

        await UserInfo.updateOne({ email: email }, { password: hashPassword });
        res.status(200).json("good")
    } else {
        res.status(403).json('Invalid Token')
    }



})

router.post('/address/crud/:action', ensureToken, async (req, res) => {
    try {
        const { email, index } = req.body
        const data = req.body.address;
        const action = req.params.action;


        if (verifyToken(req.token)) {

            var userData = await UserInfo.findOne({ email: email });
            if (action === 'add') {

                await UserInfo.updateOne({ email: email }, { address: [...userData.address, data] });
                res.status(200).json('address added')

            } else if (action === 'remove') {
                var filArr = userData.address.filter((each, i) => {
                    if (index !== i) {
                        return each;
                    }

                })

                await UserInfo.updateOne({ email: email }, { address: filArr });
                res.status(200).json('address removes')

            }
        } else {
            res.status(403).json('Invalid Token')
        }


    } catch (error) {
        res.status(200).json(error)
    }


})

router.post('/wishlist/crud/:action/:email', ensureToken, async (req, res) => {

    try {
        const { action, email } = req.params;
        const data = req.body.productInfo;

        if (verifyToken(req.token)) {

            const wlData = await WishListInfo.findOne({ email: email });
            if (action === 'add') {
                if (wlData) {
                    await WishListInfo.updateOne({ email: email }, { products: [...wlData.products, data] });
                } else {
                    await WishListInfo.create({
                        email,
                        products: [data]
                    })
                }

                res.status(200).json('product added');
            } else if (action === 'remove') {
                var filArr = wlData.products.filter((each) => {
                    if (each.productId !== data.productId) {
                        return each;
                    }

                })

                await WishListInfo.updateOne({ email: email }, { products: filArr });

                res.status(200).json('product removes')

            }


        } else {
            res.status(403).json('Invalid Token')
        }

    } catch (error) {
        res.status(200).json({ msg: error.message })

    }



})

router.post('/orders',ensureToken,async(req,res)=>{
    try {
        const order = req.body.order;
        if(verifyToken(req.token)){

            const oData = await OrdersInfo.findOne({email:order.email})
            if (oData) {
                var data  = await OrdersInfo.updateOne({ email: order.email }, { orders: [...oData.orders, {products:order.products,address:order.address,date:order.date,total:order.total}] });
            } else {
                data = await OrdersInfo.create({
                    email:order.email,
                    orders:[{products:order.products,address:order.address,date:order.date,total:order.total}]
                })
            }
            res.status(200).json(data)

        } else {
            res.status(403).json('Invalid Token')
        }
    } catch (error) {
        res.json(error.message)
    }
})


router.post('/search', async (req, res) => {
    var query = req.body.query.toLowerCase();
    var queryArr = query.split(' ');


    if (query.includes('women')) {
        let women = await WomenProductInfo.find();
        var data = women.map((each) => {
            let e = each.toObject()
            return { ...e, url: '/women/All/' + e.productId }
        })
    } else if (query.includes('men')) {
        let men = await MenProductInfo.find();
        data = men.map((each) => {
            let e = each.toObject()
            return { ...e, url: '/men/All/' + e.productId }
        })
    } else if (query.includes('kids')) {
        let kids = await KidsProductInfo.find();
        data = kids.map((each) => {
            let e = each.toObject()
            return { ...e, url: '/kids/All/' + e.productId }
        })
    } else {

        const men = await MenProductInfo.find();
        const women = await WomenProductInfo.find();
        const kids = await KidsProductInfo.find();

        data = [...men.map((each) => {
            let e = each.toObject()
            return { ...e, url: '/men/All/' + e.productId }
        }),
        ...women.map((each) => {
            let e = each.toObject()
            return { ...e, url: '/women/All/' + e.productId }
        }),
        ...kids.map((each) => {
            let e = each.toObject()
            return { ...e, url: '/kids/All/' + e.productId }
        })];

    }
    // by category
    var cate = []
    data.filter((item) => {
        let one = false
        queryArr.forEach((eachQry) => {
            if (item.category.toLowerCase().includes(eachQry) && eachQry != '' && eachQry.length > 2) {
                cate.push(item);
            }
            one = true
        })


    })
    // by tag
    var cateAndTag = []
    if (cate.length !== 0) {
        var fil01 = cate
    } else {
        fil01 = data
    }
    fil01.filter((item) => {
        let one = false
        queryArr.forEach((eachQry) => {
            if (item.tag.includes(eachQry) && eachQry != '' && eachQry.length > 2) {
                cateAndTag.push(item);
            }
            one = true
        })
    })

    // by name
    var nameFilter = []
    let i = 0;
    do {
        data.filter((item) => {
            // queryArr.forEach((eachQry) => {

            if (item.name.toLowerCase().includes(queryArr[i]) && queryArr[i] != '' && queryArr[i].length > 2) {
                if (queryArr[i] !== 'men' && queryArr[i] !== 'women' && queryArr[i] !== ('kids')) {

                    nameFilter.push(item);
                }
            }
            // })

        })
        i++;
    }
    while (nameFilter.length === 0 && i < queryArr.length);



    if (query == 'men' || query === 'women' || query == 'kids' || query == 'men ' || query === 'women ' || query == 'kids ') {
        var final = data;

    } else {
        if (cateAndTag.length === 0 && cate.length === 0) {
            final = nameFilter;

        } else {

            final = (cate.length != 0) ? ((cateAndTag.length != 0) ? cateAndTag : cate) : cateAndTag;
        }

    }
    res.status(200).json(final);

})


router.get('/stock/:gender/:category', async (req, res) => {
    const category = req.params.category;
    const gender = req.params.gender;
    if (gender === 'men') {
        var data = await MenProductInfo.find();

    } else if (gender == 'women') {

        data = await WomenProductInfo.find();
    } else {
        data = await KidsProductInfo.find();
    }
    const filArr = data.filter((each) => {
        if (category === 'All') {
            return each;
        } else if (category === each.category) {
            return each;
        }
    })
    res.status(200).json(filArr)
});

router.get('/product/:gender/:category/:productId', async (req, res) => {
    const category = req.params.category;
    const gender = req.params.gender;
    const productId = req.params.productId;
    if (gender === 'men') {
        var data = await MenProductInfo.find();

    } else if (gender == 'women') {

        data = await WomenProductInfo.find();
    } else {
        data = await KidsProductInfo.find();
    }
    const filArr = data.filter((each) => {
        if (productId === each.productId) {
            return each;
        }
    })
    res.status(200).json(filArr)
})

router.get('/address/:email', ensureToken, async (req, res) => {
    try {

        const email = req.params.email;
        if (verifyToken(req.token)) {

            var data = await UserInfo.findOne({ email: email });
            res.status(200).json(data.address)
        } else {
            res.status(403).send('Invalid Token')
        }
    } catch (error) {
        res.json(error)
    }


});
router.get('/orders/:email', ensureToken, async (req, res) => {
    try {

        const email = req.params.email;
        if (verifyToken(req.token)) {

            var data = await OrdersInfo.findOne({ email: email });
            res.status(200).json(data)
        } else {
            res.status(403).send('Invalid Token')
        }
    } catch (error) {
        res.json(error)
    }


});

router.get('/wishlist/:email', ensureToken, async (req, res) => {
    try {
        const email = req.params.email;
        if (verifyToken(req.token)) {
            var wishListData = await WishListInfo.findOne({ email: email });

            res.status(200).json((wishListData) ? wishListData.products : [])

        } else {
            res.status(403).send('Invalid Token')

        }
    } catch (error) {
        res.json({ msg: error.message })

    }
})




export default router;