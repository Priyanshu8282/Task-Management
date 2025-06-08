const mongoose = require('mongoose');/*------ Mongoose Require ------*/
const dotenv = require('dotenv');/*------ Dotenv Require ------*/

/*------ Config Dotenv ------*/
dotenv.config();

const connectDb = async () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log('MongoDB connection error:', err));
}

module.exports = connectDb;/*------ Export ConnectDB ------*/