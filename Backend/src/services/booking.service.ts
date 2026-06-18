import { Request } from "express";
import { Iuser } from "../middleware/authenticate";
import { bits, BookingStatus } from "../data/AppEnum";
import Booking from "../model/booking.modal";
import {
  resSuccess,
  resBadRequest,
  resNotFound,
  resDuplicateConflict,
} from "../utils/shareFunction";
import { Op, Sequelize, Transaction } from "sequelize";
import Cars from "../model/car.modal";
import Users from "../model/user.modal";
import { attribute } from "../utils/app-constant";
import dbcontext from "../config/db";

export const createBooking = async (req: Request) => {
  try {
    const u_id = (req as Iuser).user.id;
    const { c_id, pickup_date, return_date, total_days, total_price } =
      req.body;

    const today = new Date().toISOString().split("T")[0];
    if (pickup_date <= today) {
      return resBadRequest({
        message: "Pickup Date is too early select appropriate one",
      }); //400
    }
    // overlap check against Confirmed and Active only
    const car = await Cars.findOne({
      where: { id: c_id, is_deleted: bits.zero, availability_status: bits.one },
    });

    if (!car) {
      return resNotFound({ message: "Car is No Longer Available" }); // 404
    }
    const overlap = await Booking.findOne({
      where: {
        c_id,
        is_deleted: bits.zero,
        booking_status: {
          [Op.in]: [BookingStatus.Confirmed, BookingStatus.Active],
        },
        pickup_date: { [Op.lte]: return_date },
        return_date: { [Op.gte]: pickup_date },
      },
    });

    if (overlap) {
      return resDuplicateConflict({
        message: "Car is not available for the selected dates",
      }); // 409
    }

    await Booking.create({
      c_id,
      u_id,
      pickup_date,
      return_date,
      total_days,
      total_price,
      booking_status: BookingStatus.Pending,
      created_at: new Date(),
    });

    return resSuccess({ message: "Booking created successfully" }); // 200
  } catch (e: any) {
    throw e; // 500
  }
};
export const getOwnerBookings = async (req: Request) => {
  try {
    const u_id = (req as Iuser).user.id;

    const ownerCars = await Cars.findAll({
      where: { u_id },
      attributes: ["id"],
    });

    const carIds = ownerCars.map((car) => car.id);

    const bookings = await Booking.findAll({
      where: {
        c_id: { [Op.in]: carIds },
        is_deleted: bits.zero,
      },
      //order: [["created_at", "DESC"]],
      order: [
        [
          Sequelize.literal(`
  CASE booking_status
    WHEN 'Pending'   THEN 0
    WHEN 'Confirmed' THEN 1
    WHEN 'Active'    THEN 2
    WHEN 'Completed' THEN 3
    WHEN 'Rejected'  THEN 4
    WHEN 'Cancelled' THEN 5
  END
`),
          "ASC",
        ],
        ["c_id", "ASC"],
      ],
      include: [
        {
          model: Cars,
          as: "car",
          attributes: [
            "brand",
            "model",
            "year",
            "city",
            "category",
            "seating_capacity",
            "transmission",
          ],
        },
      ],
      attributes: [
        "id",
        "pickup_date",
        "return_date",
        "total_days",
        "created_at",
        "total_price",
        "booking_status",
        [
          Sequelize.literal(`(
        SELECT ci.image_url
        FROM car_images as ci
        WHERE ci.car_id = "car"."id"
        AND ci.is_deleted = '${bits.zero}'
        ORDER BY ci.id ASC
        LIMIT 1
      )`),
          "car_image",
        ],
      ],
    });

    if (!bookings || bookings.length === 0) {
      return resNotFound({ message: "No bookings found for your cars" }); // 404
    }

    return resSuccess({
      message: "Owner bookings retrieved successfully",
      data: bookings,
    }); // 200
  } catch (e: any) {
    throw e; // 500
  }
};
export const checkAvailability = async (req: Request) => {
  try {
    const c_id = Number(req.query.c_id);
    const pickup_date = req.query.pickup_date as string;
    const return_date = req.query.return_date as string;

    if (!c_id || !pickup_date || !return_date) {
      return resBadRequest({
        message: "c_id, pickup_date and return_date are required",
      }); // 400
    }
    const today = new Date().toISOString().split("T")[0];
    if (pickup_date <= today) {
      return resBadRequest({
        message: "Pickup Date is too early select appropriate one",
      }); //400
    }
    const car = await Cars.findOne({
      where: { id: c_id, is_deleted: bits.zero, availability_status: bits.one },
    });

    if (!car) {
      return resNotFound({ message: "Car is No Longer Available" }); // 404
    }
    const overlap = await Booking.findOne({
      where: {
        c_id,
        is_deleted: bits.zero,
        booking_status: {
          [Op.in]: [BookingStatus.Confirmed, BookingStatus.Active],
        },
        pickup_date: { [Op.lte]: return_date },
        return_date: { [Op.gte]: pickup_date },
      },
    });
    if (overlap) {
      return resDuplicateConflict({
        message: "Not Available",
        data: { available: false },
      }); //409
    }
    return resSuccess({ message: "Availability", data: { available: true } }); // 200
  } catch (e: any) {
    throw e; // 500
  }
};
export const getMyBookings = async (req: Request) => {
  try {
    const u_id = (req as Iuser).user.id;

    const bookings = await Booking.findAll({
      where: {
        u_id,
        is_deleted: bits.zero,
      },
      order: [
        [
          Sequelize.literal(`
  CASE booking_status
    WHEN 'Pending'   THEN 0
    WHEN 'Confirmed' THEN 1
    WHEN 'Active'    THEN 2
    WHEN 'Completed' THEN 3
    WHEN 'Rejected'  THEN 4
    WHEN 'Cancelled' THEN 5
  END
`),
          "ASC",
        ],
        ["c_id", "ASC"],
      ],
      include: [
        {
          model: Cars,
          as: "car",
          attributes: [
            "brand",
            "model",
            "year",
            "city",
            "category",
            "seating_capacity",
            "transmission",
          ],
        },
      ],
      attributes: [
        "id",
        "pickup_date",
        "return_date",
        "total_days",
        "created_at",
        "total_price",
        "booking_status",
        [
          Sequelize.literal(`(
        SELECT ci.image_url
        FROM car_images as ci
        WHERE ci.car_id = "car"."id"
        AND ci.is_deleted = '${bits.zero}'
        ORDER BY ci.id ASC
        LIMIT 1
      )`),
          "car_image",
        ],
      ],
    });

    if (!bookings || bookings.length === 0) {
      return resNotFound({ message: "No bookings found" }); // 404
    }

    return resSuccess({
      message: "Bookings retrieved successfully",
      data: bookings,
    }); // 200
  } catch (e: any) {
    throw e; // 500
  }
};
export const updateBookingStatus = async (req: Request) => {
  try {
    const u_id = (req as Iuser).user.id;
    const id = Number(req.params.id);
    const { status } = req.body;

    if (![BookingStatus.Confirmed, BookingStatus.Rejected].includes(status)) {
      return resBadRequest({ message: "Invalid status" }); // 400
    }

    const booking = await Booking.findOne({
      where: {
        id,
        is_deleted: bits.zero,
        booking_status: BookingStatus.Pending,
      },
    });

    if (!booking) {
      return resNotFound({ message: "Booking is already cancelled by user" }); // 404
    }

    // verify the booking belongs to owner's car
    const car = await Cars.findOne({
      where: { id: booking.c_id, u_id, is_deleted: bits.zero },
    });

    if (!car) {
      return resNotFound({ message: "Unauthorized Access " }); // 404
    }

    const trn = await dbcontext.transaction();
    try {
      await Booking.update(
        { booking_status: status, updated_at: new Date() },
        {
          where: { id },
          transaction: trn,
        },
      );

      // auto-reject all other overlapping pending bookings for same car
      if (status === BookingStatus.Confirmed) {
        await Booking.update(
          { booking_status: BookingStatus.Rejected, updated_at: new Date() },
          {
            where: {
              id: { [Op.ne]: id },
              c_id: booking.c_id,
              is_deleted: bits.zero,
              booking_status: BookingStatus.Pending,
              pickup_date: { [Op.lte]: booking.return_date },
              return_date: { [Op.gte]: booking.pickup_date },
            },
            transaction: trn,
          },
        );
      }
      await trn.commit();
      return resSuccess({ message: `Booking ${status} successfully` }); // 200
    } catch (e) {
      await trn.rollback();
      throw e;
    }
  } catch (e: any) {
    throw e; // 500
  }
};
export const cancelBooking = async (req: Request) => {
  try {
    const u_id = (req as Iuser).user.id;
    const id = Number(req.params.id);

    const booking = await Booking.findOne({
      where: {
        id,
        u_id,
        is_deleted: bits.zero,
        booking_status: {
          [Op.in]: [BookingStatus.Pending, BookingStatus.Confirmed],
        },
      },
    });

    if (!booking) {
      return resNotFound({
        message: "Booking cannot be cancelled",
      }); // 404
    }

    await Booking.update(
      { booking_status: BookingStatus.Cancelled, updated_at: new Date() },
      { where: { id } },
    );

    return resSuccess({ message: "Booking cancelled successfully" }); // 200
  } catch (e: any) {
    throw e; // 500
  }
};
export const getBookingById = async (req: Request) => {
  try {
    const u_id = (req as Iuser).user.id;
    const id = Number(req.params.id);
    const bookings = await Cars.findOne({
      include: [
        {
          model: Users,
          as: "userdetail",
          attributes: ["name", "email", "phone_no"],
        },
        {
          model: Booking,
          as: "booking",

          attributes: [
            "id",
            "pickup_date",
            "return_date",
            "total_days",
            "total_price",
            "booking_status",
            "created_at",
          ],
          where: {
            u_id,
            id,
            is_deleted: bits.zero,
          },
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

    if (!bookings) {
      return resNotFound({ message: "No bookings found" }); // 404
    }

    return resSuccess({
      message: "Bookings retrieved successfully",
      data: bookings,
    }); // 200
  } catch (e: any) {
    throw e; // 500
  }
};
export const getOwnerDashboard = async (req: Request) => {
  try {
    const u_id = (req as Iuser).user.id;

    // All cars (for booking counts — includes deleted cars)
    const ownerCars = await Cars.findAll({
      where: { u_id },
      attributes: ["id","is_deleted"],
    });

    const carIds = ownerCars.map((car) => car.id);

    // Only non-deleted cars (for totalCars count)
    const totalCars = ownerCars.filter((car) => car.is_deleted===bits.zero).length;

    if (carIds.length === 0) {
      return resSuccess({
        message: "Dashboard data retrieved successfully",
        data: {
          totalCars: 0,
          totalBookings: 0,
          pendingCount: 0,
          confirmedCount: 0,
          activeCount: 0,
          completedCount: 0,
          rejectedCount: 0,
          cancelledCount: 0,
          monthlyRevenue: 0,
          recentBookings: [],
        },
      });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [statusCounts, revenueResult, recentBookings] = await Promise.all([
      // 1. all status counts (bookings of deleted cars included)
      Booking.findAll({
        where: {
          c_id: { [Op.in]: carIds },
          is_deleted: bits.zero,
        },
        attributes: [
          "booking_status",
          [Sequelize.fn("COUNT", Sequelize.col("bookings.id")), "count"],
        ],
        group: ["booking_status"],
        raw: true,
      }) as unknown as Promise<{ booking_status: string; count: string }[]>,

      // 2. monthly revenue (bookings of deleted cars included)
      Booking.findOne({
        where: {
          c_id: { [Op.in]: carIds },
          is_deleted: bits.zero,
          booking_status: {
            [Op.in]: [ BookingStatus.Active, BookingStatus.Completed],
          },
          pickup_date: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
        },
        attributes: [
          [
            Sequelize.fn("COALESCE", Sequelize.fn("SUM", Sequelize.col("total_price")), 0),
            "monthlyRevenue",
          ],
        ],
        raw: true,
      }) as unknown as Promise<{ monthlyRevenue: string } | null>,

      // 3. recent bookings (bookings of deleted cars included)
      Booking.findAll({
        where: {
          c_id: { [Op.in]: carIds },
          is_deleted: bits.zero,
        },
        order: [["created_at", "DESC"]],
        limit: 5,
        include: [
          {
            model: Cars,
            as: "car",
            attributes: ["brand", "model", "year"],
          },
        ],
        attributes: [
          "id",
          "pickup_date",
          "return_date",
          "total_days",
          "total_price",
          "booking_status",
          "created_at",
          [
            Sequelize.literal(`(
              SELECT ci.image_url
              FROM car_images as ci
              WHERE ci.car_id = "car"."id"
              AND ci.is_deleted = '${bits.zero}'
              ORDER BY ci.id ASC
              LIMIT 1
            )`),
            "car_image",
          ],
        ],
      }),
    ]);

    const getCount = (status: BookingStatus) =>
      parseInt(
        (statusCounts as { booking_status: string; count: string }[]).find(
          (r) => r.booking_status === status,
        )?.count ?? "0",
      );

    return resSuccess({
      message: "Dashboard data retrieved successfully",
      data: {
        totalCars,
        totalBookings: (statusCounts as { booking_status: string; count: string }[]).reduce(
          (sum, r) => sum + parseInt(r.count),
          0,
        ),
        pendingCount:   getCount(BookingStatus.Pending),
        confirmedCount: getCount(BookingStatus.Confirmed),
        activeCount:    getCount(BookingStatus.Active),
        completedCount: getCount(BookingStatus.Completed),
        rejectedCount:  getCount(BookingStatus.Rejected),
        cancelledCount: getCount(BookingStatus.Cancelled),
        monthlyRevenue: parseFloat(
          (revenueResult as { monthlyRevenue: string } | null)?.monthlyRevenue ?? "0",
        ),
        recentBookings,
      },
    });
  } catch (e: any) {
    throw e;
  }
};