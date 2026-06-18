import { Request } from "express";
import { Iuser } from "../middleware/authenticate";
import { bits, BookingStatus, CarCategory } from "../data/AppEnum";
import Cars from "../model/car.modal";
import dbcontext from "../config/db";
import CarImages from "../model/car_image.modal";
import {
  resBadRequest,
  resDuplicateConflict,
  resNotFound,
  resSuccess,
} from "../utils/shareFunction";
import { Model, Op, Sequelize, where } from "sequelize";
import Users from "../model/user.modal";
import { attribute } from "../utils/app-constant";
import Booking from "../model/booking.modal";


export const getMyCar = async (req: Request) => {
  try {
    const id = (req as Iuser).user.id;
    const car = await Cars.findAll({
      where: { u_id: id, is_deleted: bits.zero },

      attributes: [
        ...attribute,
        [
          Sequelize.literal(`(
          SELECT COALESCE(array_agg(ci.image_url ORDER BY ci.id), '{}')
          FROM car_images as ci 
            WHERE ci.car_id=cars.id
            AND ci.is_deleted = '${bits.zero}'
       )`),
          "images",
        ],
      ],
    });
    if (!car || car.length === 0) {
      return resNotFound({ message: "No cars found for the user" }); //404
    }
    return resSuccess({
      message: "User's cars retrieved successfully",
      data: car,
    }); //200
  } catch (e: any) {
    throw e; //500
  }
};
export const getAllAvailableCar = async (req: Request) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;
    const whereCondition = {
      ...{ availability_status: bits.one, is_deleted: bits.zero },
      ...(search && {
        [Op.or]: [
          { brand: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } },
          { city: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };
    const { rows, count } = await Cars.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["updated_at", "ASC"]],
      include: [
        {
          model: Users,
          as: "userdetail",
          attributes: ["name", "email", "phone_no"],
        },
      ],
      attributes: [
        ...attribute,
        [
          Sequelize.literal(`(
          SELECT COALESCE(array_agg(ci.image_url ORDER BY ci.id), '{}')
          FROM car_images as ci 
            WHERE ci.car_id=cars.id
            AND ci.is_deleted = '${bits.zero}'
       )`),
          "images",
        ],
      ],
    });
    if (!rows || rows.length === 0) {
      return resSuccess({
    message: "No available cars found",
    data: {
      car: [],
      pagination: {
        totalRecords: count,
        page: page,
        totalPages: Math.ceil(count / limit) || 1,
        limit,
      }, //200
    },
  }); 
    }
    return resSuccess({
      message: "Available cars retrieved successfully",
      data: {
        car: rows,
        pagination: {
          totalRecords: count,
          page: page,
          totalPages: Math.ceil(count / limit),
          limit,
        },
      },
    }); //200
  } catch (e: any) {
    throw e; //500
  }
};
export const getCarById = async (req: Request) => {
  const id = req.params.id as string;
  try {
    const car = await Cars.findOne({
      where: { availability_status: bits.one, is_deleted: bits.zero, id: id },
      include: [
        {
          model: Users,
          as: "userdetail",
          attributes: ["name", "email", "phone_no"],
        },
      ],
      attributes: [
        ...attribute,
        [
          Sequelize.literal(`(
          SELECT COALESCE(array_agg(ci.image_url ORDER BY ci.id), '{}')
          FROM car_images as ci 
            WHERE ci.car_id=cars.id
            AND ci.is_deleted = '${bits.zero}'
       )`),
          "images",
        ],
      ],
    });
    if (!car) {
      return resNotFound({ message: "Car is Not Availablle" }); //404
    }
    return resSuccess({
      message: "car retrieved successfully",
      data: car,
    }); //200
  } catch (e: any) {
    throw e; //500
  }
};
export const addcar = async (req: Request) => {
  try {
    const id = (req as Iuser).user.id;
    const {
      brand,
      model,
      year,
      daily_price,
      category,
      transmission,
      fuel_type,
      seating_capacity,
      description,
      address,
      pincode,
      state,
      city,
      area,
      car_number,
      image_paths,
    } = req.body;
    const duplicateCar = await Cars.findOne({
      where: { car_number, is_deleted: bits.zero },
    });
    if (duplicateCar) {
      return resDuplicateConflict({
        message: "Car with the same number already exists",
      }); //409
    }
    const trn = await dbcontext.transaction();
    try {
      const newCar = await Cars.create(
        {
          u_id: id,
          created_at: new Date(),
          brand,
          model,
          year,
          daily_price,
          category,
          transmission,
          fuel_type,
          seating_capacity,
          description,
          address,
          pincode,
          state,
          city,
          area,
          car_number,
        },
        { transaction: trn },
      );
      const carId = newCar.id;
      const mappedImg = image_paths.map((image_url: string) => ({
        car_id: carId,
        image_url,
        created_at: new Date(),
      }));
      if (image_paths && Array.isArray(image_paths)) {
        await CarImages.bulkCreate(mappedImg, { transaction: trn });
      }
      await trn.commit();
      return resSuccess({ message: "Car added successfully" }); //200
    } catch (e: any) {
      await trn.rollback();
      throw e;
    }
  } catch (e: any) {
    throw e; //500
  }
};
export const deletecar = async (req: Request) => {
  try {
    const id = req.params.id as string;
    const car = await Cars.findOne({
      where: { id: id, is_deleted: bits.zero },
    });
    if (!car) {
      return resNotFound({ message: "Car Not Found" }); //404
    }
    const blockingStatuses = [
      BookingStatus.Pending,
      BookingStatus.Confirmed,
      BookingStatus.Active,
    ];
    const hasActiveBooking = await Booking.findOne({
      where: {
        c_id: id,
        booking_status: { [Op.in]: blockingStatuses },
      },
    });
      if (hasActiveBooking) {
      return resDuplicateConflict({
        message: "Car has active bookings and cannot be deleted",
      }); // 409
    }

    await Cars.update(
      { is_deleted: bits.one,availability_status:bits.zero },
      { where: { id: id, is_deleted: bits.zero } },
    );
    return resSuccess({ message: "Car deleted successfully" }); //200
  } catch (e: any) {
    throw e; //500
  }
};
export const updatecar = async (req: Request) => {
  try {
    const id = req.params.id as string;
    const status = req.body.availability_status;
    const car = await Cars.findOne({
      where: { id: id, is_deleted: bits.zero },
    });
    if (!car) {
      return resNotFound({ message: "Car is Not Availablle" }); //404
    }
    await Cars.update(
      { availability_status: status,updated_at:new Date() },
      { where: { id: id, is_deleted: bits.zero } },
    );
    return resSuccess({ message: "Car updated successfully" }); //200
  } catch (e: any) {
    throw e; //500
  }
};
