import {bits, BookingStatus, CarCategory, CarFuel, CarTransmission, role} from "./AppEnum";
export interface IUser {
  id: number;
  name: string;
  email: string;
  password:string;
  role:role;
  phone_no: string;
  profile_image: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isdeleted:bits;
}

export type TResponse = (payload: {
  code?: number;
  status?: string;
  message: string;
  data?: any;
}) => {
  code: number;
  status: string;
  message: string;
  data: any;
};

export interface ICar {
  id: number;
  u_id: number;
  brand: string;
  model: string;
  year: number;
  daily_price: number;
  category: CarCategory;
  transmission: CarTransmission;
  fuel_type: CarFuel;
  seating_capacity: number;
  description: string;
  address:string
  pincode:number;
  city:string;
  state:string;
  area:string;
  car_number:string;
  availability_status: bits;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  is_deleted:bits;
}

export interface ICarImage {
  id: number;
  car_id: number;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  is_deleted: bits;
}
export interface IBooking {
  id: number;
  c_id: number;
  u_id: number;
  pickup_date: string;
  return_date: string;
  total_days: number;
  total_price: number;
  booking_status: BookingStatus;
  updated_at: Date |null;
  created_at: Date;
  deleted_at: Date | null;
  is_deleted: bits;
}