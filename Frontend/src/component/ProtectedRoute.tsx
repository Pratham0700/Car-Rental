import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { Navigate, Outlet } from 'react-router-dom';
import ToastMessage from "../component/Toast/ToastMessage";
import { MessageType } from "../Data/AppEnum";
const ProtectedRoute = () => {
  const loggedin =  useSelector((state:RootState )=>{return state.user.isLoggedIn});
  if(!loggedin){
              ToastMessage(MessageType.Warning,"Login First");
    return <Navigate to="/" replace/>
  }
  return <Outlet/>
}

export default ProtectedRoute
