import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";
const Banner = () => {
  
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate()
  return (
    <div className='flex  flex-col  items-center  px-6 md:px-16 lg:px-24 xl:px-44'>
     <div className='flex flex-col w-full  md:flex-row md:items-start items-center justify-between  px-8 md:pl-14 py-10
     mx-3 bg-linear-to-r from-[#0558FE] to-[#A9CFFF] md:mx-auto rounded-2xl overflow-hidden'>
      <div className='text-white self-center'>
        <h2 className='text-3xl font-medium'>Do You Own a Luxury Car?</h2>
        <p className='mt-2'>Monetize your vehicle effortlessly by listing it on CarRental.</p>
        <p className='max-w-130'>We take care of insurance, driver verification and secure payments — so you can earn passive income, stress-free.</p>
        <button className='bg-white mt-4 px-6 py-2 rounded-xl transition-all text-primary
        cursor-pointer text-sm hover:bg-slate-200'
        onClick={()=>{user.isLoggedIn?navigate('/owner/dashboard'):ToastMessage(MessageType.Warning,"Login First")}}>List your car</button>
      </div>
      <img src={assets.banner_car_image} alt='car' className='max-h-45 mt-10'/>
    </div>
    </div>
  )
}

export default Banner
