import dotenv from 'dotenv'
dotenv.config();

export const port = process.env.PORT;
export const db_host = process.env.DB_HOST;
export const db_name=process.env.DB_NAME;
export const db_username=process.env.DB_USERNAME;
export const db_password=process.env.DB_PASSWORD;
export const db_port =  Number(process.env.DB_PORT)

export const salt = Number(process.env.SALT)
export const jwt_key =process.env.JWT_KEY as string


export const cloud_name  =  process.env.CLOUDINARY_CLOUD_NAME
export const api_key = process.env.CLOUDINARY_API_KEY
export const api_secret = process.env.CLOUDINARY_API_SECRET
