import { login, register,refreshToken, deleteUser } from "../services/auth.service"
import type { Request,Response } from "express";
import { handleError } from "../utils/shareFunction";

export const registerFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await register(req);
        res.status(data.code).json(data)
    }
    catch(e:any){
        handleError(res, e);
    }
}

export const loginFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await login(req);
        res.status(data.code).json(data)
    }
    catch(e:any){
        handleError(res, e);
    }
}

export const refreshTokenFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await refreshToken(req);
       res.status(data.code).json(data)
    }       
    catch(e:any){
        handleError(res, e);
    }   
}
export const deleteUserFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await deleteUser(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
        handleError(res, e);
    }   
}