import { Request, Response } from "express";
import { addcar, deletecar, getAllAvailableCar, getCarById, getMyCar, updatecar } from "../services/Car.service";
import { handleError } from "../utils/shareFunction";
export const addcarFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await addcar(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}

export const getMyCarFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await getMyCar(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}

export const getAllAvailableCarFn = async(req:Request,res:Response):Promise<void>=>{
    try{
            const data = await getAllAvailableCar(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
        handleError(res, e);
    }   
}

export const deletecarFn = async(req:Request,res:Response):Promise<void>=>{
    try{
            const data = await deletecar(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
        handleError(res, e);
    }   
}

export const updatecarFn = async(req:Request,res:Response):Promise<void>=>{
    try{
            const data = await updatecar(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
        handleError(res, e);
    }   
}
export const getCarByIdFn = async(req:Request,res:Response):Promise<void>=>{
    try{
            const data = await getCarById(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
        handleError(res, e);
    }   
}
