import { Request,Response } from "express";
import { pincode } from "../services/pincode.service";
import { handleError } from "../utils/shareFunction";
export const pincodeFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await pincode(req);
        res.status(data.code).json(data);
    }
    catch(e:any){
         handleError(res, e);
    }
}