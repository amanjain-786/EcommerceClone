import productModel from "../models/productModel.js";
import fs from 'fs';
import slugify from 'slugify'
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import braintree from "braintree";
import dotenv from 'dotenv'


dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        //we have used the express-formidabel middleware (see int productRoutes)
        //this helps us to get the photo which we nedd
        //so we take all our data from this bro
        //ham ab isse se data lenge bro 
        //we would not use the req.body as we have used this middleware bro so let's go man.
        const { name, description, slug, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation using swith case bro
        //didn't add the slud as agar name hua the slug bhi hoga hi bro
        //this size of phot should be given in kb bro to uske hisab se bharna ye to random hai

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "description is required" });
            case !price:
                return res.status(500).send({ error: "price is required" });
            case !category:
                return res.status(500).send({ error: "category is required" });
            case !quantity:
                return res.status(500).send({ error: "quantity is required" });
            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and should be less than 10mb" });
        }


        const products = new productModel({
            ...req.fields, slug: slugify(name)
        });

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "product created successfuly",
            products
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            error: err,
            message: "error in creating product"
        })
    }
}


export const getProductController = async (req, res) => {
    try {
        //in this api we don't send the photo together bro
        //we first only give the text data man
        //for photo we do another api
        //we will then merge and use these man
        //this helps in maintaining the performance of the application
        const products = await productModel
            .find({})
            .populate('category')
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All products",
            products
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            error: err,
            message: 'error in getting products'
        })
    }
}


export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            message: "single product fetched",
            product
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error while getting single product",
            error: err
        })
    }
}


//get photo controller
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            //means kuch ahi bro
            res.set('content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error while getting photo",
            error: err
        })
    }
}


export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "product deleted successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error while deleting product",
            error: err
        })
    }
}



//update the product bro 
export const updateProductController = async (req, res) => {
    try {
        console.log(req.fields);
        //we have used the express-formidabel middleware (see int productRoutes)
        //this helps us to get the photo which we nedd
        //so we take all our data from this bro
        //ham ab isse se data lenge bro 
        //we would not use the req.body as we have used this middleware bro so let's go man.
        const { name, description, slug, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation using swith case bro
        //didn't add the slud as agar name hua the slug bhi hoga hi bro
        //this size of phot should be given in kb bro to uske hisab se bharna ye to random hai

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "description is required" });
            case !price:
                return res.status(500).send({ error: "price is required" });
            case !category:
                return res.status(500).send({ error: "category is required" });
            case !quantity:
                return res.status(500).send({ error: "quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and should be less than 10mb" });
        }


        const products = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true });

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "product updated successfuly",
            products
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            error: err,
            message: "error in updating product"
        })
    }
}



//product filters
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) {
            args.category = checked;
        }
        if (radio.length) {
            //in radio we could have selected only one bro 
            //so iski length to one hi hogi na so we will directly access karege bro so let's go man
            args.price = { $gte: radio[0], $lte: radio[1] }
        }

        try {
            const products = await productModel.find(args);
            res.status(200).send({
                success: true,
                products
            })
        }
        catch (err) {
            console.log(err);
            res.status(500).send({
                success: false,
                error: err
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            success: false,
            message: "error while filtering products",
            error: err
        })
    }
}


//product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            message: "error in product count",
            error: err,
            success: false
        })
    }
}


//product list based on page
export const productListController = async (req, res) => {
    try {
        const perPage = 6;//as we need only this much on a single page bro

        //means agar page mil gaya to thik nahi to we have added the default value bro
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            success: false,
            message: "Error in per page ctrl",
            error: err
        });
    }
};



//search product controller
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const resutls = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })
            .select("-photo");
        return res.json(resutls);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
};



//similar products
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            success: false,
            message: "error while getting related product",
            error: err
        })
    }
}



//get product by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category: category }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            category,
            products
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            success: false,
            message: "error in fetching product by caegory",
            error: err
        })
    }
}







//payments ka chakar

//making a gateway bro
//and ye hamne upar kara hai bro so let's go

//payment gateway api.
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                return res.send(500).send(err);
            }
            else {
                res.send(response);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

//payment
export const braintreePaymentController = async (req, res) => {
    try {
        //nonce ye braintree ka khudka hai see in documentation bro don't worry man
        const { cart, nonce } = req.body;
        let total = 0;
        cart?.map((i) => { total = total + i.price });

        //creating a transaction bro
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        },
            function (err, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                }
                else {
                    res.status(500).send(err);
                }
            }
        )
    }
    catch (err) {
        console.log(err);
    }
}