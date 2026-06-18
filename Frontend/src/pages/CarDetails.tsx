import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../component/Loader";
import type { IAvailableCar } from "../Data/AppInterface";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import axiosInstance from "../component/axiosInstance";
import CarNotFound from "../component/CarNotFound";

import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";

const CarDetails = () => {
  const { id } = useParams();
  let c_id = Number(id);
  const navigate = useNavigate();
  const [car, setCar] = useState<IAvailableCar | null>(null);
  const [loading, setloading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY;
  const Cars = useSelector((state: RootState) => state.cars.cars);
  const loggedIn = useSelector((state:RootState)=>{return state.user.isLoggedIn})
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  
  const user = useSelector((state: RootState) => state.user);
  const [Available, setAvailable] = useState<
    "available" | "unavailable"|"notloggedin" | null
  >(null);

  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetch = async () => {
      setloading(true);
      const car = Cars.find((car) => car.id === c_id) || null;
      if (car) {
        setCar(car);
        setloading(false);
        return;
      }
      try {
        const res = await axiosInstance.get(`/car/available/${c_id}`);
        setCar(res.data.data);
      } catch (e: any) {
        const statuscode = e.response.status;
        if (statuscode === 404) {
          setCar(null);
        } else {
                  ToastMessage(MessageType.Error,"Server Error try again later");

        }
      } finally {
        setloading(false);
      }
    };
    fetch();
  }, [id]);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkAvailability = async () => {
    try {
      setAvailable(null);
      await axiosInstance.get("/booking/check-availability", {
        params: {
          c_id: c_id,
          pickup_date: pickupDate,
          return_date: returnDate,
        },
      });
      setAvailable("available");
    } catch (e: any) {
      const status = e.response?.status;
      if (status === 400) {
        ToastMessage(MessageType.Error,e.response.data.message); // "Pickup Date is too early..."
        setPickupDate("");
        setReturnDate("");
        setAvailable(null);
      }else if(status==404){
        ToastMessage(MessageType.Error,e.response.data.message);
        setCar(null)
      }
       else if (status === 409) {
        setAvailable("unavailable");
      } else {
                ToastMessage(MessageType.Error,"Server Error try again later");

        setPickupDate("");
        setReturnDate("");
        setAvailable(null);
      }
    }
  };
  useEffect(() => {
    if (pickupDate && returnDate && loggedIn ) {
      checkAvailability();
    }
  }, [pickupDate, returnDate]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!loggedIn)
    {
      ToastMessage(MessageType.Warning,"login first to book the car");
      return;
    }
     if(!user.profile?.phone_no)
    {
            ToastMessage(MessageType.Warning,"Complete Profile First");

      navigate("/profile");
      return;
    }
    if (Available === "available") {
      await handlebooking();
    }
  };
  const handlebooking = async () => {
    // CHANGED: added async and API call
    try {
      const res = await axiosInstance.post("/booking/create", {
        c_id,
        pickup_date: pickupDate,
        return_date: returnDate,
        total_days: totalDays,
        total_price: totalPrice,
      });
      ToastMessage(MessageType.Success,res.data.message); // "Booking created successfully"
      navigate("/my-bookings")
    } catch (e: any) {
      const status = e.response?.status;
      if (status === 409) {
        ToastMessage(MessageType.Error,e.response.data.message); // "Car is not available for the selected dates"
        setAvailable("unavailable"); // CHANGED: mark as unavailable if overlap found
      } else if (status === 400) {
        ToastMessage(MessageType.Error,e.response.data.message); // "Pickup Date is too early..."
        setPickupDate("");
        setReturnDate("");
        setAvailable(null);
      }
      else if (status === 404) {
        ToastMessage(MessageType.Error,e.response.data.message); 
        setCar(null)
      } else {
                ToastMessage(MessageType.Error,"Server Error try again later");

        setPickupDate("");
        setReturnDate("");
        setAvailable(null);
      }
    }
  };

  const totalDays =
    pickupDate && returnDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1,
        )
      : 0;
  const totalPrice = totalDays * (car?.daily_price ?? 0);

  const prev = () =>
    setActiveIndex((i) => (i - 1 + car!.images.length) % car!.images.length);
  const next = () => setActiveIndex((i) => (i + 1) % car!.images.length);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-8">
      <button
        className="flex items-center text-gray-500 gap-2 mb-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img
          src={assets.arrow_icon}
          alt="arrow icon"
          className="rotate-180 opacity-65"
        />{" "}
        Back to all Cars
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          {/* Image */}
          {/* Image Gallery */}
          {/* Image Gallery */}
          {/* Image Gallery */}
          <div className="flex flex-col gap-3 mb-6 max-lg:gap-5">
            {/* Top row: main image + right-side thumbnails on lg+ */}
            <div className="flex gap-3">
              {/* Main image */}
              <div
                className="relative rounded-xl overflow-hidden bg-gray-100 w-full
      h-[28rem] max-lg:h-[22rem] max-md:h-[18rem] max-sm:h-[14rem]"
              >
                <img
                  src={ car.images[activeIndex]}
                  alt="Car Image"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 bottom-4 rounded-full shadow flex items-center justify-center bg-white/10 transition"
                    >
                      <img
                        src={assets.chevron_left}
                        className="size-11 max-sm:size-7 pr-1"
                      />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-3 bottom-4 rounded-full bg-white/10 shadow flex items-center justify-center transition"
                    >
                      <img
                        src={assets.chevron_right}
                        className="size-11 max-sm:size-7 pl-1"
                      />
                    </button>
                  </>
                )}
              </div>

              {/* Right-side vertical thumbnails — lg+ only */}
              {car.images.length > 0 && (
                <div className="hidden lg:flex flex-col gap-2 w-16 shrink-0 overflow-y-auto max-h-[28rem]">
                  {car.images.map((img, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all
              ${i === activeIndex ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-90"}`}
                    >
                      <img
                        src={ img}
                        alt={`Car image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom horizontal thumbnails — below lg, hidden on sm */}
            {car.images.length > 1 && (
              <div className="flex lg:hidden max-sm:hidden flex-row gap-2 overflow-x-auto pb-1">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all
            ${i === activeIndex ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-90"}`}
                  >
                    <img
                      src={img}
                      alt={`Car image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Below Image */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </div>
            <hr className="border-borderColor " />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.city },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center p-4 bg-light rounded-lg gap-2"
                >
                  <img src={icon} className="h-5" />
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <div>
              <h1 className="font-medium text-xl mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>
            {/* pickup location */}
            <div>
              <h1 className="font-medium text-xl mb-3">Pickup Location</h1>
              <div className="border border-gray-200 rounded-xl p-5 bg-white mb-4">
                <div className="grid grid-cols-2 gap-3 flex-col max-sm:flex">
                  <div className="bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
                    <img src={assets.home_icon} className=" size-7 my-1" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Address</p>
                      <p className="text-[15px] text-gray-900 font-medium leading-snug">
                        {car.address}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
                    <img src={assets.map_icon} className=" size-7 my-1" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Area</p>
                      <p className="text-[15px] text-gray-900 font-medium">
                        {car.area} {car.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
                    <img
                      src={assets.appartment_icon}
                      className=" size-7 my-1"
                    />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">City</p>
                      <p className="text-[15px] text-gray-900 font-medium">
                        {car.city}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
                    <img src={assets.flag_icon} className=" size-7 my-1" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">State</p>
                      <p className="text-[15px] text-gray-900 font-medium">
                        {car.state}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-3">Owner Details</h1>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                {/* Header */}
                <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-200 bg-gray-50">
                  <img src={assets.colour_user_icon} className=" size-7 my-1" />
                  <span className="text-[15px] font-medium text-gray-800">
                    Owner Details
                  </span>
                </div>

                {/* Rows */}
                {[
                  { label: "Name", value: car.userdetail.name },
                  { label: "Email", value: car.userdetail.email },
                  { label: "Phone", value: car.userdetail.phone_no },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    className={`flex items-center px-4 py-3 ${i !== arr.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <span className="text-sm text-gray-400 w-20 shrink-0">
                      {label}
                    </span>
                    <span className="text-[15px] text-gray-900 font-medium">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="shadow-lg h-max rounded-xl text-gray-500 top-18 p-6 space-y-6 sticky"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-bold">
            {currency}
            {car.daily_price}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>
          <hr className="border-borderColor" />

          <div className="flex flex-col gap-2">
  <label htmlFor="pickup-date">Pickup Date</label>
  <input
    type="date"
    id="pickup-date"
    min={getTomorrowDate()}
    max={returnDate}
    value={pickupDate}
    onKeyDown={(e) => e.preventDefault()}
    onChange={(e) => {
      setPickupDate(e.target.value);
      setAvailable(null);
      if (returnDate && returnDate < e.target.value) setReturnDate(e.target.value);
    }}
    className="border border-gray-400 rounded-lg py-2 px-3"
    required
  />
</div>

<div className="flex flex-col gap-2">
  <label htmlFor="return-date">Return Date</label>
  <input
    type="date"
    id="return-date"
    min={pickupDate || getTomorrowDate()}
    value={returnDate}
    onKeyDown={(e) => e.preventDefault()}
    onChange={(e) => {
      setReturnDate(e.target.value);
      setAvailable(null);
    }}
    className="border border-gray-400 rounded-lg py-2 px-3"
    required
  />
</div>
          {pickupDate && returnDate && loggedIn && (
            <div className="bg-light rounded-xl p-4 space-y-3 border border-borderColor">
              <div className="flex justify-between  flex-col gap-1 sm:flex-row">
                <h3 className="font-medium text-gray-800 text-base">
                  Booking Summary
                </h3>
                {Available === null && (
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                    Checking availability...
                  </p>
                )}
                {Available === "available" && (
                  <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    Available
                  </p>
                )}
                {Available === "unavailable" && (
                  <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                    Not Available
                  </p>
                )}
              </div>
              <hr className="border-borderColor" />

              <div className="flex justify-between text-sm">
                <span>Pickup</span>
                <span className="text-gray-800 font-medium">
                  {new Date(pickupDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Return</span>
                <span className="text-gray-800 font-medium">
                  {new Date(returnDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Duration</span>
                <span className="text-gray-800 font-medium">
                  {totalDays} {totalDays === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Rate</span>
                <span className="text-gray-800 font-medium">
                  {currency}
                  {car.daily_price} × {totalDays}{" "}
                  {totalDays === 1 ? "day" : "days"}
                </span>
              </div>

              <hr className="border-borderColor" />

              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span className="text-primary text-lg">
                  {currency}
                  {totalPrice}
                </span>
              </div>
            </div>
          )}

          <button
            disabled={
              loggedIn && (Available === "unavailable" ||
              (Available === null && !!(pickupDate && returnDate)))
            }
            className="bg-primary text-white rounded-xl cursor-pointer w-full transition-all
  hover:bg-primary-dull font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!pickupDate || !returnDate || !loggedIn
              ? "Book Now"
              : Available === null
                ? "Checking..."
                : Available === "available"
                  ? `Book for ${currency}${totalPrice}`
                  : "Not Available"}
          </button>

          <p className="text-center text-sm">
            No credit card required to reserve
          </p>
        </form>
      </div>
    </div>
  ) : loading ? (
    <Loader />
  ) : (
    <CarNotFound />
  );
};
export default CarDetails;
