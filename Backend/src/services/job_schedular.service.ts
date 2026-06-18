import cron from 'node-cron';
import dbcontext from '../config/db';
import { BookingStatus } from '../data/AppEnum';

// runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
  const [active]: any = await dbcontext.query(`UPDATE bookings SET booking_status = '${BookingStatus.Active}' 
  WHERE booking_status = '${BookingStatus.Confirmed}' AND pickup_date <= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`)

const [completed]: any = await dbcontext.query(`UPDATE bookings SET booking_status = '${BookingStatus.Completed}' 
  WHERE booking_status = '${BookingStatus.Active}' AND return_date < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`)

const [rejected]: any = await dbcontext.query(`UPDATE bookings SET booking_status = '${BookingStatus.Rejected}' 
  WHERE booking_status = '${BookingStatus.Pending}' AND pickup_date <= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`)
} catch (err) {
  console.error("[CRON ERROR]", err);
}
  console.log('[CRON] Booking job completed');
});

console.log('[CRON] Booking job registered');