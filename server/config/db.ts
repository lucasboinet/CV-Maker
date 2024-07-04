const mongoose = require('mongoose');
require('dotenv').config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CREDENTIALS, {useNewUrlParser: true});
        console.log("MongoDB is connected...");
    } catch(err) {
        console.error(err);
    }
}