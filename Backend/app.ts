import express from 'express'
import router from './src/routes/indexRoutes';
import cors from 'cors'
import dbcontext from './src/config/db';
import { port} from './src/config/AppConfig';
import './src/services/job_schedular.service'
const app = express();
app.use(cors({origin:'https://car-rental-peach-beta.vercel.app/',methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api',router)

app.listen(port,async()=>{
  try
  {
    console.log(`app is running on ports ${port}`)
    await dbcontext.authenticate();
    console.log('Database connected successfully')
  }
  catch(e)
  {
    console.log(e)
  }
});