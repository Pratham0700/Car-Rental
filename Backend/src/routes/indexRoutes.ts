import { deleteUserFn, loginFn, refreshTokenFn, registerFn } from "../controller/auth.controller";
import {Router} from 'express'
import authenticate from "../middleware/authenticate";
import { profileFn, updateprofileFn } from "../controller/profile.controller";
import { pincodeFn } from "../controller/pincode.controller";
import { uploadFn } from "../controller/upload.controller";
import { addcarFn,  deletecarFn,  getAllAvailableCarFn, getCarByIdFn, getMyCarFn, updatecarFn } from "../controller/Car.controller";
import { cancelBookingFn, checkAvailabilityFn, createBookingFn, getBookingByIdFn, getMyBookingsFn, getOwnerBookingsFn, getOwnerDashboardFn, updateBookingStatusFn } from "../controller/booking.controller";



const router = Router();
router.get('/pincode/:pin',[authenticate],pincodeFn)

//Authentication
router.post('/register',registerFn);
router.post('/login',loginFn)
router.post('/refresh-token',[authenticate],refreshTokenFn)

//Users
router.get('/profile',[authenticate],profileFn)
router.put('/profile',[authenticate],updateprofileFn)
router.post('/upload',[authenticate],uploadFn)
router.delete('/delete-user',[authenticate],deleteUserFn)

//Cars
router.post('/car',[authenticate],addcarFn)
router.get('/car/my-cars',[authenticate],getMyCarFn)
router.get('/car/available',[],getAllAvailableCarFn)
router.delete('/car/:id',[authenticate],deletecarFn)
router.patch('/car/:id',[authenticate],updatecarFn)
router.get('/car/available/:id',[],getCarByIdFn)

//Bookings
router.post('/booking/create',[authenticate],createBookingFn)
router.get('/booking/owner',[authenticate],getOwnerBookingsFn)
router.get('/booking/check-availability',[authenticate],checkAvailabilityFn)
router.get('/booking/user',[authenticate],getMyBookingsFn)
router.patch('/booking/owner/:id',[authenticate],updateBookingStatusFn)
router.patch('/booking/user/:id',[authenticate],cancelBookingFn)

router.get('/booking/:id',[authenticate],getBookingByIdFn)
router.get('/owner/dashboard',[authenticate],getOwnerDashboardFn)
export default router

