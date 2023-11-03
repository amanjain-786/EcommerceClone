import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken';


export const registerController = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        //validation
        if (!name) {
            return res.send({ message: 'name is required' });
        }
        if (!email) {
            return res.send({ message: 'email is required' });
        }
        if (!password) {
            return res.send({ message: 'password is required' });
        }
        if (!phone) {
            return res.send({ message: 'phone number is required' });
        }
        if (!address) {
            return res.send({ message: 'address is required' });
        }
        if (!answer) {
            return res.send({ message: 'answer is required' });
        }

        //checking existing user
        //based only on email bro as hame bas vahi unique chahiye man
        const existingUser = await userModel.findOne({
            email
        });
        if (existingUser) {
            res.status(200).send({
                success: false,
                message: 'already registered please login'
            })
        }

        //as there was no existing user so hame usse regiter kara denge bro
        //hash the password
        const hashedPassword = await hashPassword(password);
        //save the user
        const user = new userModel({
            name, email, phone, address,
            password: hashedPassword, answer
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "user registerd successfully",
            user
        })
    }
    catch (err) {
        console.log(err);
        res.status(500);
        res.send({
            success: false,
            message: ' error in registration ',
            err
        })
    }
}



export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        //now agar email mil bhi gaya then i have to compare the password
        //database has the hashed value to hame vo bhi dekhna hoga bro so let's do it man
        //check user 
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "email not registered"
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "invalid password"
            })
        }

        //i.e user bhi hai and password bhi match ho gaya bro so here i have to create a token man
        //so i have to do it here bro
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success: true,
            message: "login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error in login",
            err
        })
    }
}



//forgotPasswordController
export const forgotPasswordController = async (req, res, next) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "email is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "new password is required" });
        }

        //check email and answer if corrent then only we change it bro
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'wrong email of answer'
            })
        }
        //means sab sahi hai bro so i change it man
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "password resed successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "something went wrong",
            err
        })
    }
}




//test controller
export const testController = (req, res, next) => {
    console.log("protected route");
    return res.send("done");
}


//update user profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //check the password
        if (password && password.length < 6) {
            return res.json({ error: "password is required and must be 6 characters long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true });
        res.status(200).send({
            success: true,
            message: "profile updated successfully",
            updatedUser
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            success: false,
            message: "Error while updating profile",
            error: err
        })
    }
}




//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await
            orderModel
                .find({ buyer: req.user._id })
                .populate('products', "-photo")
                .populate('buyer', "name");

        res.json(orders);

    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error while getting orders",
            error: err
        })
    }
}






//all orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await
            orderModel
                .find({})
                .populate('products', "-photo")
                .populate('buyer', "name")
                .sort({ createdAt: "-1" });

        res.json(orders);

    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error while getting orders",
            error: err
        })
    }
}



//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(orders);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error while updating order",
            error: err
        })
    }
}