import { useEffect, useState } from 'react'
import Title from '../component/Title'
import { assets } from '../assets/assets'
import type { IUserBookings } from '../Data/AppInterface'
import axiosInstance from '../component/axiosInstance'
import { BookingStatus, type BookingStatusType } from '../Data/AppEnum'
import { useNavigate } from 'react-router-dom'
import NoBooking from '../component/NoBooking'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import CancelModal from '../component/CancelModal'

import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";
import { currency } from '../config/AppConfig'

const statusConfig: Record<BookingStatusType, { pill: string; dot: string }> = {
  [BookingStatus.Pending]:   { pill: "bg-amber-100 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-400" },
  [BookingStatus.Confirmed]: { pill: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",       dot: "bg-sky-500"   },
  [BookingStatus.Active]:    { pill: "bg-lime-100 text-lime-800 ring-1 ring-lime-200",    dot: "bg-lime-600"  },
  [BookingStatus.Completed]: { pill: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200", dot: "bg-indigo-500" },
  [BookingStatus.Rejected]:  { pill: "bg-red-100 text-red-800 ring-1 ring-red-200",       dot: "bg-red-500"   },
  [BookingStatus.Cancelled]: { pill: "bg-stone-100 text-stone-700 ring-1 ring-stone-200", dot: "bg-stone-400" },

};

const MyBooking = () => {
  const [bookings, setbookings] = useState<IUserBookings[]>([]);
  const [confirm, setconfirm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IUserBookings | null>(null);
  
  const loggedIn = useSelector((state:RootState)=>{return state.user.isLoggedIn})
  const navigate=useNavigate()
  const Currency: string = currency
  const fetch =async()=>{
      try{
      const res = await axiosInstance.get("/booking/user");
      setbookings(res.data.data)
      }
      catch(e:any){
         const status = e.response?.status;
      if (status === 404) {
        setbookings([]);
      }
      else
      {
        ToastMessage(MessageType.Error,"Server Error try again later");
        setbookings([]);
      }
    }
    }
  useEffect(() => {
    if(!loggedIn)
    {
      return;
    }
    fetch();
  }, []);

  const handlecancel =async(id:number)=>{

     try{
      await axiosInstance.patch(`/booking/user/${id}`);
      const updatedBooking = bookings.map((b)=>
        (b.id===id && ([BookingStatus.Pending, BookingStatus.Confirmed].includes(b.booking_status)) )?
           {...b,booking_status:BookingStatus.Cancelled}: b);
      setbookings(updatedBooking)
      }
      
      catch(e:any){
         const status = e.response?.status;
      if (status === 404) {
        ToastMessage(MessageType.Error,e.response.data.message);
        fetch();
      }
      else
      {
        ToastMessage(MessageType.Error,"Server Error try again later");
        setbookings([])
      }
    }
  }

  const openCancelModal = (booking: IUserBookings) => {
    setSelectedBooking(booking);
    setconfirm(false);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBooking(null);
    setconfirm(false);
  };

  const confirmCancelBooking = () => {
    if (!selectedBooking) return;

    handlecancel(selectedBooking.id);
    setShowCancelModal(false);
    setSelectedBooking(null);
    setconfirm(false);
  };

  if(bookings.length===0)
      {
          return(<NoBooking/>)
      }

  return (
    <div className='px-4 md:px-10 lg:px-20 xl:px-24 2xl:px-32 mt-12 mb-20 max-w-7xl mx-auto'>
      {showCancelModal && !confirm && (
        <CancelModal
          setconfirm={setconfirm}
          title="Cancel booking"
          message={`Are you sure you want to cancel your booking for ${selectedBooking?.car.brand} ${selectedBooking?.car.model}?`}
          confirmText="Cancel booking"
          onClose={closeCancelModal}
          onConfirm={confirmCancelBooking}
        />
      )}
      <div className="mb-10">
        <Title title="My Bookings" subtitle="View and manage your car bookings" align="left" />
      </div>

      <div className='flex flex-col gap-8'>
        {bookings.map((booking, index) => (
          <div 
            key={booking.id} 
            className='bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden flex flex-col lg:flex-row lg:h-[280px]' >
            
            {/* 1. FIXED IMAGE SECTION */}
            <div className='lg:w-80 lg:min-w-[320px] h-56 lg:h-full relative flex-shrink-0'>
              <img 
                src={booking.car_image} 
                alt="car" 
                className='w-full h-full object-cover'
              />
              <div className='absolute top-3 left-3 lg:hidden'>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusConfig[booking.booking_status].pill}`}>
                  {booking.booking_status}
                </span>
              </div>
            </div>

            {/* 2. INFO SECTION */}
            <div className='flex-1 p-6 flex flex-col justify-between min-w-0'>
              <div>
                <div className='flex items-center gap-3 mb-1'>
                  <span className='text-[10px] font-bold text-slate-400 uppercase'>ID: #{index + 101}</span>
                  <span className={`hidden lg:block px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${statusConfig[booking.booking_status].pill}`}>
                    {booking.booking_status}
                  </span>
                </div>
                <h3 className='text-xl font-extrabold text-slate-800 leading-tight'>
                  {booking.car.brand} <span className='text-blue-600'>{booking.car.model}</span>
                </h3>
                <p className='text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wide'>
                  {booking.car.year} • {booking.car.category}
                </p>
              </div>

              {/* DETAILS COLUMN (Stacked Layout) */}
              <div className='flex flex-col gap-2 mt-4'>
                {/* Rental Period Box */}
                <div className='flex items-center gap-4 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100'>
                  <div className='flex items-center gap-2 min-w-[100px]'>
                    <img src={assets.calendar_icon_colored} alt="" className='w-3.5 h-3.5' />
                    <p className='text-[10px] font-bold text-slate-400 uppercase'>Rental</p>
                  </div>
                  <div className='flex items-center gap-2 text-xs font-bold text-slate-700'>
                    <span>{booking.pickup_date.split('T')[0]}</span>
                    <span className='text-slate-300 font-normal'>→</span>
                    <span>{booking.return_date.split('T')[0]}</span>
                  </div>
                </div>

                {/* Location Box */}
                <div className='flex items-center gap-4 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100'>
                  <div className='flex items-center gap-2 min-w-[100px]'>
                    <img src={assets.location_icon_colored} alt="" className='w-3.5 h-3.5' />
                    <p className='text-[10px] font-bold text-slate-400 uppercase'>Location</p>
                  </div>
                  <p className='text-xs font-bold text-slate-700 truncate'>
                    {booking.car.city}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. PRICE SECTION */}
            <div className='lg:w-64 lg:min-w-[256px] p-6 bg-slate-50/50 lg:border-l border-slate-100 flex flex-col justify-center items-center lg:items-end'>
              <div className='text-center lg:text-right w-full'>
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Total Amount</p>
                <div className='flex items-center justify-center lg:justify-end gap-1 mt-1 text-blue-600'>
                  <span className='text-lg font-bold'>{Currency}</span>
                  <span className='text-3xl font-black'>{booking.total_price.toLocaleString()}</span>
                </div>
                <p className='text-[10px] text-slate-400 mt-2 font-medium uppercase'>
                  Booked: {new Date(booking.created_at).toLocaleDateString()}
                </p>
              </div>
            <div className='flex w-full gap-5 lg:flex-col lg:gap-0'>
              <button className='w-full mt-6 py-3 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]'
              onClick={()=>navigate(`/my-bookings/${booking.id}`)}>
                Booking Details
              </button>
              {[BookingStatus.Pending, BookingStatus.Confirmed].includes(booking.booking_status) && 
              <button className='w-full mt-6 py-3 px-4 bg-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-red-700 transition-all active:scale-[0.98]'
              onClick={()=>openCancelModal(booking)}>
                Cancel Booking
              </button>}
            </div>
              
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBooking
