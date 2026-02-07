import Mailgen from "mailgen"
import nodemailer from "nodemailer"

import {MAILTRAP_HOST, MAILTRAP_USER, MAILTRAP_PASSWORD, MAILTRAP_PORT} from "../config/env.js";

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            name: "Project Manager",
            link: "https://projectmanager.io"
        }
    });

    const mailText = mailGenerator.generatePlaintext(options.content);
    const mailHtml = mailGenerator.generate(options.content);

    const transporter = nodemailer.createTransport({
        host: MAILTRAP_HOST,
        port: MAILTRAP_PORT,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASSWORD,
        }
    });

    const mail = {
        from: "projmanager@xyz.com",
        to: options.email,
        subject: options.subject,
        text: mailText,
        html: mailHtml
    }

    try{
        await transporter.sendMail(mail);
    }catch(e){
        console.error("Error sending mail message: ", e);
    }
}

export { sendMail };