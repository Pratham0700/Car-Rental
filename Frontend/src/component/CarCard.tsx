import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import type{ IAvailableCar, ICar } from '../Data/AppInterface'
import { Bits } from '../Data/AppEnum'
type CarCardProps = {
    car: IAvailableCar
}
const CarCard = ({car}: CarCardProps) => {
    const currency= import.meta.env.VITE_CURRENCY
    const navigate=useNavigate()
  return (
    <div onClick={()=>{navigate(`/car-details/${car.id}`); scroll(0,0)}} className='group rounded-xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer
     hover:-translate-y-4'>
        <div className='relative h-48 overflow-hidden'>
            <img src={car.images[0]} alt="Car Image" className='w-full h-full object-cover transition-transform 
            duration-500 group-hover:scale-105'/>
            {car.availability_status===Bits.one && <p className='absolute top-4 left-4 text-xs px-3 py-1 bg-primary text-white 
            rounded-full'>Available Now</p>}
            <div className='absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg backdrop-blur-sm'>
                <span className='font-semibold'>{currency}{car.daily_price}</span>
                <span className='text-sm text-white/80'> / day</span>
            </div>
        </div>
        <div className='p-4 sm:p-5'>
            <div className='flex flex-col justify-between items-start mb-2'>
                <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                <p className='text-sm text-gray-700'>{car.category} • {car.year}</p>
            </div>
            <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'> 
                <div className='flex items-center text-sm'>
                    <img src={assets.users_icon} alt="user icon" className='mr-2 h-4'/>
                    <span>{car.seating_capacity} Seats</span>
                </div>
                <div className='flex items-center text-sm'>
                    <img src={assets.fuel_icon} alt="user icon" className='mr-2 h-4'/>
                    <span>{car.fuel_type} </span>
                </div>
                <div className='flex items-center text-sm'>
                    <img src={assets.car_icon} alt="user icon" className='mr-2 h-4'/>
                    <span>{car.transmission} </span>
                </div>
                <div className='flex items-center text-sm'>
                    <img src={assets.location_icon} alt="user icon" className='mr-2 h-4'/>
                    <span>{car.city} </span>
                </div>
            </div>
        </div>


    </div>
  )
}

export default CarCard
