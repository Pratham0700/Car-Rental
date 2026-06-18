import { useEffect, useState } from "react";
import type { IBookByIdCar } from "../Data/AppInterface";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import NoBooking from "../component/NoBooking";
import { assets } from "../assets/assets";

import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";

const statusStyles: Record<string, string> = {
  Active: "bg-lime-100 text-lime-800",
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-sky-100 text-sky-800",
  Cancelled: "bg-stone-100 text-stone-700",
  Rejected: "bg-red-100 text-red-800",
  Completed: "bg-indigo-100 text-indigo-800",
};

const dotColors: Record<string, string> = {
  Active: "bg-lime-600",
  Pending: "bg-amber-400",
  Confirmed: "bg-sky-500",
  Cancelled: "bg-stone-400",
  Rejected: "bg-red-500",
  Completed: "bg-indigo-500",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN").format(price);
}

export default function MyBookingDetails() {
  const [data, setdata] = useState<IBookByIdCar | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(`/booking/${id}`);
        setdata(res.data.data);
      } catch (e: any) {
        const statuscode = e.response.status;
        if (statuscode === 404) {
          setdata(null);
        } else {        
          ToastMessage(MessageType.Error,"Server Error try again later");
          setdata(null);
        }
      }
    };
    fetch();
  }, []);
  if (!data) {
    return <NoBooking />;
  }

  const booking = data.booking[0];
  const status = booking.booking_status as string;
  const imgs = data.images;
  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-24 2xl:px-32 mt-10 mb-20 max-w-7xl mx-auto">
      {/* Back */}
      <button
        className="flex items-center text-gray-500 gap-2 mb-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img
          src={assets.arrow_icon}
          alt="arrow icon"
          className="rotate-180 opacity-65"
        />{" "}
        Back to all Bookings
      </button>

      {/* Car card */}
      <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
        {/* Image */}
        <div className="w-full overflow-hidden">
          <div className="relative w-full aspect-video bg-gray-100">
            <img
              src={ imgs[currentImg]}
              alt={`${data.brand} ${data.model}`}
              className="w-full h-full object-cover"
            />
            {imgs.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImg((i) => (i === 0 ? imgs.length - 1 : i - 1))
                  }
                  className="absolute top-1/2 left-3 -translate-y-1/2 size-10 rounded-full bg-white/20 border border-gray-200 flex items-center justify-center text-gray-600  transition-colors"
                >
                  <img
                    src={assets.chevron_left}
                    className="size-11 max-sm:size-7 pr-0.5"
                  />
                </button>
                <button
                  onClick={() =>
                    setCurrentImg((i) => (i === imgs.length - 1 ? 0 : i + 1))
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 size-10 rounded-full bg-white/20 border border-gray-200 flex items-center justify-center text-gray-600  transition-colors"
                >
                  <img
                    src={assets.chevron_right}
                    className="size-11 max-sm:size-7 pl-0.5"
                  />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full">
                  {currentImg + 1} / {imgs.length}
                </div>
                <div className="flex justify-center gap-1.5 py-3 absolute bottom-3 left-1/2">
                  {imgs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${i === currentImg ? "w-5 bg-blue-600" : "w-1.5 bg-gray-300"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Car title + badge */}
        <div className="flex items-start justify-between px-5 pt-4">
          <div>
            <h1 className="text-xl font-medium text-gray-900">
              {data.brand} <span className="text-blue-600">{data.model}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{data.year}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5  font-medium px-5 py-2 rounded-full ${statusStyles[status] ?? "bg-gray-100 text-gray-600"}`}
          >
            <span
              className={`size-2.5 rounded-full mr-1.5 ${dotColors[status] ?? "bg-gray-400"}`}
            />
            {status}
          </span>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 px-5 py-3">
          {[
            data.category,
            data.transmission,
            data.fuel_type,
            `${data.seating_capacity} seats`,
          ].map((val) => (
            <span
              key={val}
              className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full"
            >
              {val}
            </span>
          ))}
        </div>

        {/* Plate */}
        <div className="mx-5 mb-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
              Plate number
            </p>
            <p className="text-sm font-medium font-mono text-gray-900">
              {data.car_number}
            </p>
          </div>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
            />
          </svg>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 border-t border-gray-100">
          {[
            { label: "Category", value: data.category },
            { label: "Transmission", value: data.transmission },
            { label: "Fuel type", value: data.fuel_type },
            { label: "Seating", value: `${data.seating_capacity} seats` },
          ].map((spec, i) => (
            <div
              key={spec.label}
              className={`px-5 py-3 ${i % 2 === 0 ? "border-r border-gray-100" : ""} ${i < 2 ? "border-b border-gray-100" : ""}`}
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
                {spec.label}
              </p>
              <p className="text-sm font-medium text-gray-900">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {data.description && (
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
              Description
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              {data.description}
            </p>
          </div>
        )}
      </div>
      {/* Owner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
          Owner details
        </p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-700 shrink-0">
            {data.userdetail.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {data.userdetail.name}
            </p>
            <p className="text-xs text-gray-500">Car owner</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <span className="text-xs text-gray-800 truncate">
              {data.userdetail.email}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            <span className="text-xs text-gray-800">
              {data.userdetail.phone_no}
            </span>
          </div>
        </div>
      </div>

      {/* Rental schedule */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
          Rental schedule
        </p>

        <div className="relative pl-7">
          {/* Pickup */}
          <div className="relative mb-4">
            <div className="absolute -left-9 top-0 size-7 mt-7 rounded-full bg-blue-50 flex items-center justify-center z-10">
              <svg
                className="size-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <div className="absolute -left-5.5 top-5 w-0.5 mt-7 bg-gray-600"
              style={{ height: "calc(100% + 16px)" }}
            />
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Pickup
              </p>
              <p className="text-base font-medium text-gray-900">
                {formatDate(booking.pickup_date)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {data.area}, {data.city}, {data.state} · {data.pincode}
              </p>
            </div>
          </div>

          {/* Return */}
          <div className="relative">
            <div className="absolute -left-9 top-0 size-7 mt-7 rounded-full bg-green-50 flex items-center justify-center z-10">
              <svg
                className="size-5 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5"
                />
              </svg>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Return
              </p>
              <p className="text-base font-medium text-gray-900">
                {formatDate(booking.return_date)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Same location · {booking.total_days}{" "}
                {booking.total_days === 1 ? "day" : "days"} rental
              </p>
            </div>
          </div>
        </div>

        {/* Schedule meta */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {[
            {
              label: "Duration",
              value: `${booking.total_days} ${booking.total_days === 1 ? "day" : "days"}`,
            },
            { label: "City", value: data.city, sub: data.state },
            { label: "Area", value: data.area },
            { label: "Pincode", value: String(data.pincode) },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-medium text-gray-900">{item.value}</p>
              {item.sub && <p className="text-xs text-gray-500">{item.sub}</p>}
            </div>
          ))}
        </div>
      </div>
      {/* Total price */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Total amount
          </p>
          <p className="text-3xl font-medium text-gray-900 tracking-tight">
            ₹{formatPrice(booking.total_price)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Final price · no additional charges
          </p>
        </div>
        <div className="text-right text-sm text-gray-500 space-y-0.5">
          <p>₹{formatPrice(data.daily_price)} / day</p>
          <p>
            × {booking.total_days} {booking.total_days === 1 ? "day" : "days"}
          </p>
          <div className="border-t border-gray-300 pt-0.5 mt-1">
            <p className="text-sm font-medium text-gray-900">
              ₹{formatPrice(booking.total_price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
