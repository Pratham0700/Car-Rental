import type {
  Bits,
  BitsType,
  BookingStatus,
  BookingStatusType,
  CarCategoryType,
  CarFuelType,
  CarTransmissionType,
} from "./AppEnum";
export interface ICar {
  _id: string;
  owner: string;
  brand: string;
  model: string;
  image: string;
  year: number;
  category: CarCategoryType;
  seating_capacity: number;
  fuel_type: CarFuelType;
  transmission: CarTransmissionType;
  pricePerDay: number;
  location: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface IUserCar {
  id: number;
  u_id: number;
  brand: string;
  model: string;
  year: number;
  daily_price: number;
  category: CarCategoryType;
  transmission: CarTransmissionType;
  fuel_type: CarFuelType;
  seating_capacity: number;
  description: string;
  address: string;
  pincode: number;
  city: string;
  state: string;
  area: string;
  car_number: string;
  availability_status: Bits;
  created_at: Date;
  images: string[];
}

export interface IUserBookings {
  id: number;
  pickup_date: string;
  return_date: string;
  total_days: number;
  total_price: number;
  booking_status: BookingStatus;
  created_at: string;
  car_image: string;
  car: {
    brand: string;
    model: string;
    year: number;
    city: string;
    category: CarCategoryType;
    seating_capacity: number;
    transmission: CarTransmissionType;
  };
}
export interface ICarFormValues {
  image: File[] | null;
  brand: string;
  model: string;
  year: string;
  daily_price: string;
  category: CarCategoryType | "";
  transmission: CarTransmissionType | "";
  fuel_type: CarFuelType | "";
  seating_capacity: string;
  address: string;
  description: string;
  pincode: string;
  state: string;
  city: string;
  area: string;
  car_number: string;
}

export interface IProfile {
  name: string;
  email: string;
  phone_no: string | null;
  profile_image: string | null;
}

export interface IUserSlice {
  profile: IProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface IAvailableCar extends IUserCar {
  userdetail: { name: string; email: string; phone_no: string };
}

export interface IBookByIdCar extends IAvailableCar {
  booking: [
    {
      id: number;
      pickup_date: string;
      return_date: string;
      total_days: number;
      total_price: number;
      booking_status: BookingStatus;
      created_at: Date;
    },
  ];
}
export interface ICarsSlice {
  cars: IAvailableCar[];
  totalRecords: number;
  page: number;
  totalPages: number;
  limit: number;
  search: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface IDashboard {
  totalCars: number;
  totalBookings: number;
  pendingCount: number;
  confirmedCount: number;
  activeCount: number;
  completedCount: number;
  rejectedCount: number;
  cancelledCount: number;
  monthlyRevenue: number;
  recentBookings: {
    id: number;
    pickup_date: string;
    return_date: string;
    total_days: number;
    total_price: number;
    booking_status: BookingStatus;
    created_at: Date;
    car_image: string;
    car: {
      brand: string;
      model: string;
      year: number;
    };
  }[];
}
