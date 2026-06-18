import { Request, Response } from "express";
import { profile,updateprofile } from "../services/Profile.service";
import { handleError } from "../utils/shareFunction";
export const profileFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await profile(req);
        res.status(data.code).json(data);
    }       
    catch(e:any){
        handleError(res, e);
    }   
}

export const updateprofileFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await updateprofile(req);
        res.status(data.code).json(data);
    }       
    catch(e:any){
        handleError(res, e);
    }   
}