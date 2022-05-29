const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

const { MONGODB_URI } = process.env;

export const connect = () => {
    // Connecting to the database
    mongoose
        .connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error: Error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};