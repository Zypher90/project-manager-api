import app from './app.js';
import {connectDB} from "./db/database.js";
import {PORT} from './config/env.js';

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on https::/localhost/${PORT}`);
        })
    })
    .catch((err) => {
        console.log("Could not connect to MongoDB");
        console.log(err);
        process.exit(1);
    });