import { Request, Response } from "express";
import { handleError } from "../utils/shareFunction";
import { cancelBooking, checkAvailability, createBooking, getBookingById, getMyBookings, getOwnerBookings, getOwnerDashboard, updateBookingStatus } from "../services/booking.service";


export const createBookingFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await createBooking(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}

export const getOwnerBookingsFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await getOwnerBookings(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}
export const checkAvailabilityFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await checkAvailability(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}


export const getMyBookingsFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await getMyBookings(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}
export const updateBookingStatusFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await updateBookingStatus(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}


export const cancelBookingFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await cancelBooking(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}

export const getBookingByIdFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await getBookingById(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}
export const getOwnerDashboardFn = async(req:Request,res:Response):Promise<void>=>{
    try{
        const data = await getOwnerDashboard(req);
        res.status(data.code).json(data)
    }       
    catch(e:any){
         handleError(res, e);
    }   
}