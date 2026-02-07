import dotenv from "dotenv";

dotenv.config(
    {
        path: "./.env",
    }
);

export const {PORT, DB_URI,
    JWT_ACCESSTOKEN, JWT_ACCESSEXPIRY, JWT_REFRESHTOKEN, JWT_REFRESHEXPIRY,
    MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASSWORD} = process.env;