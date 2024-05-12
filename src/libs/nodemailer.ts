import * as nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../config";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
    },
});

export const sendMail = async (
    to: string,
    subject: string,
    message: string,
    template: string
) => {
    const info = await transporter.sendMail({
        from: `"Summarizer" <${EMAIL}>`,
        to,
        subject,
        text: message,
        html: template,
    });
    return info;
};
