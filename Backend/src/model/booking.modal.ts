import dbcontext from "../config/db";
import { INTEGER, STRING, DATE, Model, Optional, ENUM, DECIMAL, DATEONLY, BelongsToMany } from "sequelize";
import { BookingStatus } from "../data/AppEnum";
import { IBooking } from "../data/AppInterface";
import { bits } from "../data/AppEnum";
import Cars from "./car.modal";

interface IBookingAttributes extends Optional<
  IBooking,
  "id" | "updated_at" | "deleted_at" | "is_deleted"
> {}

interface IBookingInstance extends Model<IBooking, IBookingAttributes>, IBooking {}

const Booking = dbcontext.define<IBookingInstance>(
  "bookings",
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    c_id: {
      type: INTEGER,
      allowNull: false,
    },
    u_id: {
      type: INTEGER,
      allowNull: false,
    },
    pickup_date: {
      type: DATEONLY,
      allowNull: false,
    },
    return_date: {
      type: DATEONLY,
      allowNull: false,
    },
    total_days: {
      type: INTEGER,
      allowNull: false,
    },
    total_price: {
      type: INTEGER,
      allowNull: false,
    },
    booking_status: {
      type: ENUM(...Object.values(BookingStatus)),
      allowNull: false,
      defaultValue: BookingStatus.Pending,
    },
    updated_at: {
      type: DATE,
      allowNull: true,
    },
    created_at: {
      type: DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DATE,
      allowNull: true,
    },
    is_deleted: {
      type: ENUM(...Object.values(bits)),
      allowNull: false,
      defaultValue: bits.zero,
    },
  },
  {
    timestamps: false,
  }
);
Cars.hasMany(Booking,{foreignKey:'c_id',as:"booking"});
Booking.belongsTo(Cars, { foreignKey: "c_id", as: "car" });
export default Booking;