import dbcontext from "../config/db";
import { INTEGER, STRING, DATE, Model, Optional } from "sequelize";
import { role ,bits} from "../data/AppEnum";
import {IUser} from "../data/AppInterface";
import Cars from "./car.modal";
 
interface IUserAttributes extends Optional<IUser, "id"  | "updatedAt" | "deletedAt" | "isdeleted"  | "profile_image" | "phone_no" > {}

interface IUserInstance
  extends Model<IUser, IUserAttributes>,
    IUser {}

const Users = dbcontext.define<IUserInstance>("users", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING(100),
    allowNull: false,
  },
  email: {
    type: STRING(100),
    allowNull: false,
  },
  password:{
    type: STRING(255),
    allowNull: false,
  },
  role: {
    type: STRING(15),
    allowNull: false,
    defaultValue: role.user,
  },
  phone_no: {
    type: STRING(15),
    allowNull: true, 
  },
  profile_image: {
    type: STRING(255),
    allowNull: true,
  },
  createdAt: {
    type: DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DATE,
    allowNull: true,
  },
  deletedAt: {
    type: DATE,
    allowNull: true,

  },  isdeleted: {
    type: STRING(1),
    allowNull: false,
    defaultValue: bits.zero,
  },
}, {
  timestamps: false
});

Users.hasMany(Cars, { foreignKey: "u_id", as: "UC" });
Cars.belongsTo(Users, { foreignKey: "u_id", as: "userdetail" });
export default Users;