import dbcontext from "../config/db";
import { INTEGER, STRING, DATE, Model, Optional, ENUM, DECIMAL, TEXT } from "sequelize";
import {  bits, CarTransmission,CarFuel,CarCategory } from "../data/AppEnum";
import { ICar } from "../data/AppInterface";
import CarImages from "./car_image.modal";

interface ICarAttributes extends Optional<
  ICar,
  "id" | "updated_at" | "deleted_at" | "is_deleted" | "availability_status"
> {}

interface ICarInstance extends Model<ICar, ICarAttributes>, ICar {}

const Cars = dbcontext.define<ICarInstance>(
  "cars",
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    u_id: {
      type: INTEGER,
      allowNull: false
    },
    brand: {
      type: STRING(100),
      allowNull: false,
    },
    model: {
      type: STRING(100),
      allowNull: false,
    },
    year: {
      type: INTEGER,
      allowNull: false,
    },
    daily_price: {
      type: INTEGER,
      allowNull: false,
    },
    category: {
      type: ENUM(...Object.values(CarCategory)),
      allowNull: false,
    },
    transmission: {
      type: ENUM(...Object.values(CarTransmission)),
      allowNull: false,
    },
    fuel_type: {
      type: ENUM(...Object.values(CarFuel)),
      allowNull: false,
    },
    seating_capacity: {
      type: INTEGER,
      allowNull: false,
    },
    car_number: {
      type: STRING(20),
      allowNull: false,
    },
    description: {
      type: TEXT,
      allowNull: false,
    },
    address: {
      type: STRING(255),
      allowNull: false,
    },
    pincode: {
      type: INTEGER,
      allowNull: false,
    },
    city: {
      type: STRING(100),
      allowNull: false,
    },
    state: {
      type: STRING(100),
      allowNull: false,
    },
    area: {
      type: STRING(100),
      allowNull: false,
    },
    availability_status: {
      type: ENUM(...Object.values(bits)),
      allowNull: false,
      defaultValue: bits.zero,
    },
    created_at: {
      type: DATE,
      allowNull: false,
    },
    updated_at: {
      type: DATE,
      allowNull: true,
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
  },
);
Cars.hasMany(CarImages, { foreignKey: "car_id", as: "img" });
CarImages.belongsTo(Cars, { foreignKey: "car_id" });
export default Cars;

