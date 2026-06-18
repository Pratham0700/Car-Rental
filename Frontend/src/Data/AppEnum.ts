 export enum CarCategory  {
  Sedan = "Sedan",
  SUV = "SUV",
  Van = "Van",
  Hatchback = "Hatchback",
  Luxury = "Luxury",
  Sports = "Sports"
} 
export type CarCategoryType = keyof typeof CarCategory;


 export enum CarTransmission  {
    Automatic = "Automatic",
    Manual = "Manual",
    SemiAutomatic = "Semi-Automatic"
} 
export type CarTransmissionType = keyof typeof CarTransmission;


export enum CarFuel  {
    Petrol = "Petrol",
    Diesel = "Diesel",
    Electric = "Electric",
    Hybrid = "Hybrid",
    CNG = "CNG"
} 
export type CarFuelType = keyof typeof CarFuel;

export enum BookingStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Rejected = "Rejected",
    Active ="Active",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export type BookingStatusType = keyof typeof BookingStatus;
export enum MessageType {
    Error="error" ,
    Success = "success",
    Warning =  "warning",
    Info="info"
}

export enum Bits{
    one ='1',
    zero = '0'
}
export type BitsType = keyof typeof Bits;

