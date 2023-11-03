import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController
} from '../controller/productController.js';
import formidable from 'express-formidable';


const router = express.Router();


//routes

//create a product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);


//get all products
router.get('/get-product', getProductController);


//to get the single product
router.get('/get-product/:slug', getSingleProductController);


//to get the photo bro
router.get('/product-photo/:pid', productPhotoController);


//to delete the product bro
router.delete('/delete-product/:pid', deleteProductController);


//to update the product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);



//filter product
router.post('/product-filter', productFilterController);


//product count
//the below is for pagination bro taki ek baar mein saara data na jae
router.get('/product-count', productCountController);


//procut per page
router.get('/product-list/:page', productListController);



//serch product 
router.get('/search/:keyword', searchProductController);



//similar product
router.get('/related-product/:pid/:cid', relatedProductController);


//category wise product
router.get('/product-category/:slug', productCategoryController);



//payements routes
//getting token
//this is coming from brain tree taki apna account verify ho
//as then only we can do transaction
router.get('/braintree/token', braintreeTokenController);

//payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController);

export default router;