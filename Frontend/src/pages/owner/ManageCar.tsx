import Title from "../../component/owner/Title"
import {assets} from "../../assets/assets"
import type { IUserCar} from "../../Data/AppInterface"
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../component/axiosInstance";
import { Bits } from "../../Data/AppEnum";
import CancelModal from "../../component/CancelModal";

import ToastMessage from "../../component/Toast/ToastMessage";
import { MessageType } from "../../Data/AppEnum";
import { currency } from "../../config/AppConfig";
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: Bits;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked === Bits.one?true:false}
      onClick={onChange}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400
        ${checked===Bits.one ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200
          ${checked===Bits.one ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

const ManageCar = () => {
    const [cars, setCars] = useState<IUserCar[]>([]);  
    const [confirm, setconfirm] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState<IUserCar | null>(null);
    const carsRef = useRef<IUserCar[]>(cars);
    useEffect(() => {
  carsRef.current = cars; // keeps ref updated on every render
}, [cars]);
    useEffect(() => {
      const fetchdata = async()=>{
        await getdata()
      }
      fetchdata();
      return () => {
    }
    }, [])
    
  const getdata = async()=>{
    try{
      const response = await axiosInstance.get('/car/my-cars');
      setCars(response.data.data)
    }
    catch(e:any)
    {
       const statuscode = e.response.status;
        if(statuscode === 404)
        {
          setCars([])
        }
        else{
        ToastMessage(MessageType.Error,"Server Error try again later");
        }
    }
    
  }
  const toggleAvailability= async(id: number,status:Bits)=> {
    status = (status === Bits.one ?Bits.zero:Bits.one);
    setCars((prev) =>
      prev.map((car) =>
        
        car.id === id ? { ...car, availability_status: status } : car
      )
    );
    try{
      await axiosInstance.patch(`/car/${id}`,{availability_status:status});
    }
    catch(e:any)
    {
       const statuscode = e.response.status;
        if(statuscode === 404)
        {
          ToastMessage(MessageType.Error,e.response.data.message);
        }
        else{
        ToastMessage(MessageType.Error,"Server Error try again later");
        }
    }
  }
 
  const  deleteCar= async(id: number)=> {
    
    try{
      await axiosInstance.delete(`/car/${id}`);
      setCars((prev) => prev.filter((car) => car.id !== id));
    }
    catch(e:any)
    {
       const statuscode = e.response.status;
        if(statuscode === 404)
        {
          ToastMessage(MessageType.Error,e.response.data.message);
        }
        else if(statuscode===409)
        {
          ToastMessage(MessageType.Error,e.response.data.message);
        }
        else{
        ToastMessage(MessageType.Error,"Server Error try again later");
        }
    }
  }

  const openDeleteModal = (car: IUserCar) => {
    setSelectedCar(car);
    setconfirm(false);
    setShowCancelModal(true);
  };

  const closeDeleteModal = () => {
    setShowCancelModal(false);
    setSelectedCar(null);
    setconfirm(false);
  };

  const confirmDeleteCar = () => {
    if (!selectedCar) return;

    deleteCar(selectedCar.id);
    setShowCancelModal(false);
    setSelectedCar(null);
    setconfirm(false);
  };

  return (
    <>
    {showCancelModal && !confirm && (
      <CancelModal
        setconfirm={setconfirm}
        title="Delete car"
        message={`Are you sure you want to delete ${selectedCar?.brand} ${selectedCar?.model}? This action cannot be undone.`}
        confirmText="Delete car"
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteCar}
      />
    )}
    <div>
      <Title title={"Manage Cars"} subtitle={"View all listed cars, update their details, or remove them from the booking platform."}/>
       <div className="w-full font-sans mt-10">
 
      {/* ── Table Card ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
 
        {/* ── Table Header ── */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b  border-gray-100 bg-gray-50">
          {["Car", "Category", "Price", "Status", "Actions"].map((h) => (
            <p key={h} className={`text-xs font-semibold text-gray-400 uppercase tracking-wider  ${h === "Car" ? "" : "text-center"} `}>
              {h}
            </p>
          ))}
        </div>
 
        {/* ── Rows ── */}
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300 gap-2">
              <img src={assets.car_icon} alt="No cars" className="size-30 opacity-50" />
            <p className="text-sm">No cars listed yet</p>
          </div>
        ) : (
          cars.map((car, idx) => (
            <div
              key={car.id}
              className={`flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4  items-start md:items-center px-5 py-4
                ${idx !== cars.length - 1 ? "border-b border-gray-100" : ""}
                hover:bg-gray-50/60 transition-colors duration-150`}
            >
              {/* Car */}
              <div className="flex items-center gap-3 min-w-0 ">
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-14 h-12 rounded-lg object-cover shrink-0 border border-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=150";
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {car.seating_capacity} seats •{" "}
                    {car.transmission.toLowerCase()}
                  </p>
                </div>
              </div>
 
              {/* Category */}
              <div className="flex items-center gap-2 md:block">
                <span className="text-xs text-gray-400 md:hidden font-medium">Category:</span>
                <p className="text-sm text-gray-600 md:text-center">{car.category}</p>
              </div>
 
              {/* Price */}
              <div className="flex items-center gap-2 md:block">
                <span className="text-xs text-gray-400 md:hidden font-medium">Price:</span>
                <p className="text-sm font-medium text-gray-700 md:text-center">
                  {currency}{car.daily_price}/day
                </p>
              </div>
 
              {/* Status toggle */}
              <div className="flex items-center gap-2 md:justify-center">
                    
                <span className="text-xs text-gray-400 md:hidden font-medium">status:</span>
                <ToggleSwitch
                  checked={car.availability_status}
                  onChange={() => toggleAvailability(car.id,car.availability_status)}
                />
                
              </div>
 
              {/* Actions */}
              <div className="flex items-center md:justify-center">
                <button
                  onClick={() => openDeleteModal(car)}
                  aria-label={`Delete ${car.brand} ${car.model}`}
                  className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
                >
                  <img src={assets.delete_icon} alt="Delete" className="size-13" />
                </button>
              </div>
              
            </div>
          ))
        )}
      </div>
 
      {/* Row count */}
      {cars.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 px-1">
          {cars.length} car{cars.length !== 1 ? "s" : ""} listed
        </p>
      )}
    </div>
    </div>
    </>
  )
}

export default ManageCar
