import mongoose, { connect } from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(` connected to mongodb database ${conn.connection.host}`)
    }
    catch (err) {
        console.log(" error in mongodb connection ")
        console.log(err);
    }
}

export default connectDB;