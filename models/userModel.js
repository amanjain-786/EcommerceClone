import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: {},
        requried: true
    },
    answer: {
        type: String,
        requried: true
    },
    role: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

//timestamp ka use ---> whenever new user create hoga vo time add ho jaega bro

export default mongoose.model('users', userSchema);