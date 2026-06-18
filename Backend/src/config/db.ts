import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'
import { db_host, db_name, db_password, db_port, db_username } from './AppConfig'

dotenv.config()

const dbcontext = new Sequelize({
    host:db_host,
    database:db_name,
    username:db_username,
    password:db_password,
    port:db_port,
    dialect:'postgres', 
    dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

export default dbcontext