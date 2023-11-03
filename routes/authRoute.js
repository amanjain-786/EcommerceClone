import express from 'express';
import {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController
} from '../controller/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
//router object
const router = express.Router();


//routing

//REGISTER || METHOD POST
//we are using mvc architecture so iska function controller wale folder mein hoga bro to vahan dekh le 
router.post('/register', registerController);

//LOGIN || POST
router.post('/login', loginController);


//Forgot password || POST
router.post('/forgot-password', forgotPasswordController);


//test route to check the middle ware bro jo routes ko protect karega
//now ye bich mein ham kitne bhi middle ware de sakte hain and req sab se hote hue jaegi bro
//agar ek bhi middleware par req puri nahi hui 
//then req atak jaegi aur kam kahatam bro
router.get('/test', requireSignIn, isAdmin, testController);



//protected route for user
router.get('/user-auth', requireSignIn, (req, res) => {
    return res.status(200).send({ ok: true });
})

//protected route for admin 
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    return res.status(200).send({ ok: true });
})


//update profile
router.put('/profile', requireSignIn, updateProfileController);




//orders
router.get('/orders', requireSignIn, getOrdersController);



//all orders adimn
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);



//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;