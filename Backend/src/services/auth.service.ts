import type { Request } from "express"
import Users from "../model/user.modal"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Iuser } from "../middleware/authenticate"
import { jwt_key, salt } from "../config/AppConfig"
import { bits, BookingStatus, role } from "../data/AppEnum"
import { resBadRequest, resDuplicateConflict, resNotFound, resSuccess, resUnauthorizedAccess } from "../utils/shareFunction"
import Cars from "../model/car.modal"
import Booking from "../model/booking.modal"
import { Op } from "sequelize"
dotenv.config()
export const register =async( req:Request)=>{
   try {
    const {name,email,password}=req.body;
    
    // Validation
    if (!name || !email || !password) {
      return resBadRequest({message:"All fields  are required"}); //400
    }
    
    if (typeof email !== 'string' || !email.trim()) {
      return resBadRequest({message:"Valid email is required"}); //400
    }
    const duplicate = await Users.findOne({where:{email:email,isdeleted:bits.zero}})
    if(duplicate){
        return resDuplicateConflict({message:"E-Mail already exist"}); //409
    }
    const hashedpassword=await bcrypt.hash(password,salt)
    await Users.create({name:name,email:email,password:hashedpassword,createdAt:new Date(),role:role.user});
    return resSuccess({message: "User registered successfully"}); //200
   }
   catch(e:any)
   {
     throw e;
   }
}

export const login =async(req:Request)=>{
try{     const {email,password}=req.body;
    
    // Validation
    if (!email || !password) {
      return resBadRequest({message:"All fields  are required"});//400
    }
    
    if (typeof email !== 'string' || !email.trim()) {
      return resBadRequest({message:"Valid email is required"}); //400
    }
    
    const emailverify = await Users.findOne({where:{email:email,isdeleted:bits.zero}})
    if(!emailverify){
        return resNotFound({message:"Email not found"}); //404
    }
    const isMatch=await bcrypt.compare(password, emailverify.password)
    if(!isMatch){
        return resUnauthorizedAccess({message:"Invalid credentials"}); //401
    }
    const accesstoken = jwt.sign({ id: emailverify.id, email: emailverify.email,role: emailverify.role }, jwt_key as string, { expiresIn: '2h' });
    const refreshtoken = jwt.sign({ id: emailverify.id, email: emailverify.email, role: emailverify.role }, jwt_key as string, { expiresIn: '2d' });
    return resSuccess({message: "Login successful", data:{ accesstoken, refreshtoken }}); //200
  }
    catch(e:any)
    {
        throw e;//500
    }
}

export const refreshToken =async(req:Request)=>{
    try{ 
        const  {id, email, role }  = (req as Iuser).user ;
        const accessToken = jwt.sign({ id: id, email:email, role: role }, jwt_key, { expiresIn: '2h' });
        return resSuccess({message: "Token refreshed successfully",data:{accessToken} }); //200
    } 
    catch(e:any)
    {
        throw e;//500
    }
}

export const deleteUser =async(req:Request)=>{
    try{
      const id = (req as Iuser).user.id;
      const user = await Users.findOne({where:{id:id,isdeleted:bits.zero}});
      const Car = await Cars.findOne({
      where: { u_id:id,is_deleted:bits.zero },
      attributes: ["id"],
    });      
        if(Car){
            return resBadRequest({message:"Delete the listed car first"})//400
        }
        const blockingStatuses = [
      BookingStatus.Pending,
      BookingStatus.Confirmed,
      BookingStatus.Active,
    ];
    const booking =await Booking.findOne({where:{u_id:id , booking_status:{[Op.in]: blockingStatuses}}})
    if(booking){
        return resBadRequest({message:"Cancel your booking first"})//400
    }
        if(!user){
            return resNotFound({message:"User not found"}); //404
        }
        await Users.update({isdeleted:bits.one,deletedAt:new Date()},{where:{id:id,isdeleted:bits.zero}})
        return resSuccess({message: "User deleted successfully"}); //200
    }
    catch(e:any)
    {
        throw e//500
    }
}
