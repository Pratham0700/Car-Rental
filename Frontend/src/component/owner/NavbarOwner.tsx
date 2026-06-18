import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'


const NavbarOwner = () => {
  const username = useSelector((state:RootState)=>{return state.user.profile?.name})
  return (
    <>
    <div className='flex items-center justify-between px-5 md:px-10 py-2 
            text-gray-500 border-b border-borderColor transition-all' >
            <Link to="/" className='flex gap-1 items-center'>
                <img src={assets.favicon} alt="logo" className='h-10 w-10'/>
                <p className='font-black text-3xl text-gray-800'>Wheeler</p>
            </Link>
            <div>
                <div className='flex gap-1 flex-col items-center capitalize sm:flex-row '><span>Welcome</span> {username}</div>
            </div>
    </div>
    </>
  )
}

export default NavbarOwner
