import { useNavigate } from "react-router-dom";

export default function NoBooking() {
    const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-sm w-full">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1.5">No bookings yet</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          You haven't made any car bookings yet. Browse available cars and make your first booking.
        </p>
        <button
          onClick={()=>{navigate('/cars')}}
          className="w-full py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse cars
        </button>
      </div>
    </div>
  );
}