import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard'
import{useNavigate} from "react-router-dom"
import {  useSelector } from 'react-redux'
import type {  RootState } from '../store/store'
import NoCar from './NoCar'
export type{ ICar } from '../Data/AppInterface'
const FeatureSelection = () => {
    const navigate = useNavigate()
  const CarsSlice = useSelector((state: RootState) => state.cars);
  const car = CarsSlice.cars
 
  return (
    <div className='flex flex-col  items-center  py-22 px-6 md:px-16 lg:px-24 xl:px-44'>
      <div>
        <Title title={"Featured Vehicles"} 
        subtitle={"Explore our selection of premium vehicles available for your next adventure."}/>
      </div>
      {car.length>0?<div className=' w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {car.slice(0,6).map((car)=>(
            <div key={car.id} className=''>
                <CarCard car={car}/>
            </div>
        ))}
      </div>:<NoCar/>}
      {car.length>0&&<button className='flex items-center justify-center gap-2 px-6 py-2 mt-18 border border-borderColor
        rounded-md hover:bg-gray-50 cursor-pointer' onClick={()=>{navigate("/cars"); scrollTo(0,0)}}>
        Explore all cars <img src={assets.arrow_icon} alt="arrow"/></button>}
    </div>
    
  )
}

export default FeatureSelection
