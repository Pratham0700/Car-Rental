import { Request, Response } from "express";
import { upload } from "../services/upload.service";
export const uploadFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        await upload(req,res);
    }       
    catch(e:any){
        res.status(500).json({success:false,message:e.message})
    }   
}