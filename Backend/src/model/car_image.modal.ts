import dbcontext from "../config/db";
import { INTEGER, STRING, DATE, Model, Optional, ENUM } from "sequelize";
import { bits} from "../data/AppEnum";
import {ICarImage} from "../data/AppInterface";
 
interface ICarImageAttributes extends 
Optional<ICarImage, "id"  | "updated_at" | "deleted_at" | "is_deleted" > {}

interface ICarImageInstance
  extends Model<ICarImage, ICarImageAttributes>,
    ICarImage {}

const CarImages = dbcontext.define<ICarImageInstance>("car_images", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
   car_id: {
    type: INTEGER,
    allowNull: false,
  },
  image_url: {
    type: STRING,
    allowNull: false,
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

  },is_deleted: {
    type: ENUM(...Object.values(bits)),
    allowNull: false,
    defaultValue: bits.zero,
  },
}, {
  timestamps: false
});
export default CarImages;