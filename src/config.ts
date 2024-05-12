import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const PORT = process.env.PORT || 4000;
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret';
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;