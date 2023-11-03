import mongoose from 'mongoose';

//one of the thing below used is slugify bro
//it is used to handle blank spaces in the string bro
//i.e say (aman jain) vo isko aman-jain kar dega
//this is good for seo bro so isse aise hi store karna in database


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // unique: true
    },
    slug: {
        type: String,
        // lower: 
    },
})

export default mongoose.model('Category', categorySchema);