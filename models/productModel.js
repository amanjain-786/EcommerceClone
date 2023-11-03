import mongoose from 'mongoose'

const porductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        // here we create a reference to the category table bro and ye uss category ki id store karlega jo iske paas aegi
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        //we store this is mongodb here vaise agar aws ya cloudinary par store karo then they give us a link bro
        //this also has a limit ke file ka size kitna ho sakta hai so we have to keep that in mind bro
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
    }
}, { timestamps: true })

export default mongoose.model('Products', porductSchema)