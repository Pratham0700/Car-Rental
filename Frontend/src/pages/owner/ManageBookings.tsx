import Title from "../../component/owner/Title"
import type { BookingStatusType } from "../../Data/AppEnum";
import {BookingStatus} from "../../Data/AppEnum"
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { IUserBookings } from "../../Data/AppInterface";
import axiosInstance from "../../component/axiosInstance";
import ToastMessage from "../../component/Toast/ToastMessage";
import { MessageType } from "../../Data/AppEnum";
import { currency } from "../../config/AppConfig";

const statusConfig: Record<BookingStatusType, { pill: string; dot: string }> = {
  [BookingStatus.Pending]:   { pill: "bg-amber-100 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-400" },
  [BookingStatus.Confirmed]: { pill: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",       dot: "bg-sky-500"   },
  [BookingStatus.Active]:    { pill: "bg-lime-100 text-lime-800 ring-1 ring-lime-200",    dot: "bg-lime-600"  },
  [BookingStatus.Completed]: { pill: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200", dot: "bg-indigo-500" },
  [BookingStatus.Rejected]:  { pill: "bg-red-100 text-red-800 ring-1 ring-red-200",       dot: "bg-red-500"   },
  [BookingStatus.Cancelled]: { pill: "bg-stone-100 text-stone-700 ring-1 ring-stone-200", dot: "bg-stone-400" },

};

// Owner can only act on Pending bookings
const allowedTransitions: Record<BookingStatusType, BookingStatusType[]> = {
  Pending:   ["Confirmed", "Rejected"],
  Confirmed: [],
  Rejected:  [],
  Active:    [],
  Cancelled: [],
  Completed: [],
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function StatusDropdown({
  bookingId,
  status,
  onChange,
}: {
  bookingId: number;
  status: BookingStatusType;
  onChange: (id: number, val: BookingStatusType) => void;
}) {
  const [open, setOpen] = useState(false);
  let options = allowedTransitions[status]; // only valid next statuses

  return (
    <div className="relative inline-block">
      <button
        onClick={() => options.length > 0 && setOpen((v) => !v)}
        disabled={options.length === 0}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {options.length === 0 ? "No Actions" : "Actions"}
        {options.length > 0 && (
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(bookingId, opt);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors duration-150
                  ${status === opt ? "bg-gray-50 text-gray-800" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig[opt].dot}`} />
                {BookingStatus[opt]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


const ManageBookings = () => {
  const [bookings, setBookings] = useState<IUserBookings[]>([]);
const fetch = async () => {
      try {
        const res = await axiosInstance.get("/booking/owner");
        setBookings(res.data.data);
      } catch (e: any) {
        const status = e.response?.status;
        if (status === 404) {
          setBookings([]);
        } else {
        ToastMessage(MessageType.Error,"Server Error try again later");

        }
      }
    };
  useEffect(() => {
    
    fetch();
  }, []);

  async function handleStatusChange (id: number, newStatus: BookingStatusType) {
     try{
        await axiosInstance.patch(`/booking/owner/${id}`,{status:newStatus});
        ToastMessage(MessageType.Success,"Updated Sucessfully");
        await fetch();
      }
      catch(e:any){
         const status = e.response?.status;
      if (status === 400) {
                  ToastMessage(MessageType.Error,"Inappropriate Status");
        await fetch();
      }
      else if(status===404)
      {
          ToastMessage(MessageType.Error,e.response.data.message);
        await fetch();
      }
      else
      {
                ToastMessage(MessageType.Error,"Server Error try again later");

      }
    }
  }

  return (
    <div>
      <Title
        title={"Manage Bookings"}
        subtitle={"Track all customer bookings, approve or cancel requests, and manage booking status"}
      />

      <div className="w-full font-sans mt-10">
        <div className="bg-white border border-gray-200 rounded-xl overflow-visible">

          {/* Desktop Header */}
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b rounded-t-xl border-gray-100 bg-gray-50">
            {["Car", "Date Range", "Total", "Status", "Actions"].map((h) => (
              <p
                key={h}
                className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${h !== "Car" ? "text-center" : ""}`}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300 gap-2">
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className="text-sm">No bookings found</p>
            </div>
          ) : (
            bookings.map((booking, idx) => {
              const s = statusConfig[booking.booking_status];
              return (
                <div
                  key={booking.id}
                  className={`flex flex-col lg:grid lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-3 lg:gap-4 items-start lg:items-center px-5 py-5.5
                    ${idx !== bookings.length - 1 ? "border-b border-gray-100" : ""}
                    hover:bg-gray-50/60 transition-colors duration-150`}
                >
                  {/* Car */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={booking.car_image}
                      alt={`${booking.car.brand} ${booking.car.model}`}
                      className="w-14 h-12 rounded-lg object-cover shrink-0 border border-gray-100"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {booking.car.brand} {booking.car.model}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {booking.car.seating_capacity} seats •{" "}
                        {booking.car.transmission.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 lg:justify-center">
                    <span className="text-xs text-gray-400 lg:hidden font-medium">Date:</span>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.pickup_date)} To {formatDate(booking.return_date)}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="flex items-center gap-2 lg:justify-center">
                    <span className="text-xs text-gray-400 lg:hidden font-medium">Total:</span>
                    <p className="text-sm font-semibold text-gray-700">
                      {currency}{booking.total_price}
                    </p>
                  </div>

                  {/* Status pill */}
                  <div className="flex items-center gap-2 lg:justify-center">
                    <span className="text-xs text-gray-400 lg:hidden font-medium">Status:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${s.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {BookingStatus[booking.booking_status]}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center lg:w-full">
                    <StatusDropdown
                      bookingId={booking.id}
                      status={booking.booking_status}
                      onChange={handleStatusChange}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {bookings.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 px-1">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};


export default ManageBookings;
