import { Request } from "express";
import Users from "../model/user.modal";
import { Iuser } from "../middleware/authenticate";
import { bits } from "../data/AppEnum";
import { resNotFound, resSuccess } from "../utils/shareFunction";
export const profile =async(req:Request)=>{
    try{
        const user = await Users.findOne({where:{id:(req as Iuser).user.id,isdeleted:bits.zero}})      
        if(!user){
            return resNotFound({message:"User not found"}) //404
        }
        const data = {name:user.name,email:user.email,phone_no:user.phone_no,profile_image:user.profile_image}
        return resSuccess({message:"User profile retrieved successfully",data:data}) //200
    } catch (error) {
        throw error;//500
    }
}

export const updateprofile =async(req:Request)=>{
    try{
        const id = (req as Iuser).user.id
        const user = await Users.findOne({where:{id:id,isdeleted:bits.zero}})      
        if(!user){
            return resNotFound({message:"User not found"}) // 404
        }
        const {name,email,profile_image,phone_no}=req.body

        await Users.update({name,email,profile_image,phone_no,updatedAt:new Date()},{where:{id:id,isdeleted:bits.zero}})
        return resSuccess({message:"Profile updated successfully"}) //200
    } catch (error:any) {
        throw error; //500
    }
}

