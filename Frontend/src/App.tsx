import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './component/Navbar'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBooking from './pages/MyBooking'
import Footer from './component/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCar from './pages/owner/ManageCar'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './pages/Login'
import Register from './pages/Register'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store/store'
import { fetchProfile, logout } from './store/user/userSlice'
import ProtectedRoute from './component/ProtectedRoute'
import Profile from './pages/Profile'
import MyBookingDetails from './pages/MyBookingDetails'
const App = () => {
 const [showlogin, setshowlogin] = useState<boolean>(false)
  const isOwnerpath = useLocation().pathname.startsWith('/owner') || showlogin;
  const dispatch = useDispatch<AppDispatch>()
  const isloading = useSelector((state:RootState)=>{return state.user.isLoading})
  useEffect(() => {
    const checkAuth = async ()=>{
      const accesstoken = localStorage.getItem("accesstoken");
      const refreshtoken = localStorage.getItem("refreshtoken");
      if (!accesstoken || !refreshtoken) {
        dispatch(logout())
        return
      }
      await dispatch(fetchProfile());
       
    }
     
    checkAuth()
  }, [])
  
  if(isloading)
  {
     return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading...</p>
        {/* Or your spinner component */}
      </div>
    )
  }
  return (
    <>

    {!isOwnerpath && (
      <Navbar setshowlogin={setshowlogin} />
    )}

      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/car-details/:id' element={<CarDetails/>}/>
        <Route path='/cars' element={<Cars/>}/>
        <Route path='/my-bookings' element={<MyBooking/>}/>

        <Route
          path='/login'
          element={
            <Login setshowlogin={setshowlogin}/>
          }
        />
        <Route
          path='/register'
          element={
            <Register setshowlogin={setshowlogin}/>
          }
        />
        <Route element={<ProtectedRoute/>}>
        <Route path='/my-bookings/:id' element={<MyBookingDetails/>}/>
        <Route path='/profile' element={<Profile/>}/>
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='add-car' element={<AddCar/>}/>
            <Route path='manage-cars' element={<ManageCar/>}/>
            <Route path='manage-bookings' element={<ManageBookings/>}/>
          </Route>
        </Route>

      </Routes>
    {!isOwnerpath && (
      <Footer />
    )}

  </>

  )
}


export default App
