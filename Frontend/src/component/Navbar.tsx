import { useEffect, useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {  useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { logout } from '../store/user/userSlice'
const Navbar = ({setshowlogin}: {setshowlogin: (show: boolean) => void}) => {
  
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [dropdownOpen, setdropdownOpen] = useState(false)
  const location = useLocation()
  const [open, setopen] = useState(false)
  const user = useSelector((state:RootState)=>{return state.user})
  const navigate = useNavigate()
  const dispatch = useDispatch()
 useEffect(() => {
  if(user.profile?.profile_image)
  {
    const hostedImage =user.profile?.profile_image
    setProfileImg(hostedImage)
  }
    
  }, [user.profile])
  return (
    <div className={`flex items-center justify-between px-6 py-3 md:px-16 lg:px-24 xl:px-32
      text-gray-600 border-b border-borderColor relative transition-al 
      ${location.pathname==="/" ? "bg-light":"bg-white"}`}>
      <div className='flex'> 
        <Link to="/" className='flex gap-1 items-center'>
          <img src={assets.favicon} alt="logo" className='h-12 w-12'/>
          <p className='font-black text-3xl text-gray-800'>Wheeler</p>
        </Link>
      </div>
      <div className={`flex  flex-col sm:flex-row right-0 sm:gap-10 gap-3 max-sm:fixed max-sm:h-screen max-sm:w-full
        max-sm:top-16 max-sm:border-t  border-borderColor sm:items-center items-start transition-all duration-300 z-50 max-sm:p-4 
        ${location.pathname==="/" ? "bg-light":"bg-white"} ${open ? "max-sm:translate-x-0":"max-sm:translate-x-full"}` }>
        {menuLinks.map((link,index)=>(
          <Link key={index} to={link.path} className='max-sm:order-last'> 
            {link.name}
          </Link>
        ))}
          
          <div className='flex gap-6 max-sm:gap-1 max-sm:flex-col sm:items-center items-start'> 
            {user.isLoggedIn?
            // Profile Image
             <div className='relative flex flex-col items-center  max-md:mb-3 gap-3 max-sm:order-first sm:order-last'>
            
              {/* Clickable avatar */}
              <button
              onClick={()=>{setdropdownOpen(!dropdownOpen)}}
                className=" cursor-pointer group "
              >
                <img
                  src={profileImg || assets.user_profile}
                  alt='Profile'
                  className='size-13 rounded-full object-cover max-md:size-10'
                />
              </button>
               {dropdownOpen && (
                <div className='absolute right-0 max-sm:left-25 max-sm:top-0 top-16 w-56 bg-white border border-borderColor rounded-xl overflow-hidden z-50'>

                  {/* User info header */}
                  <div className='flex items-center gap-3 px-4 py-3 border-b border-borderColor'>
                    <img
                      src={profileImg || assets.user_profile}
                      alt='Profile'
                      className='size-9 rounded-full object-cover'
                    />
                    <div className='overflow-hidden'>
                      <p className='text-sm font-medium text-gray-800 truncate'>
                        {user.profile?.name || 'User'}
                      </p>
                      <p className='text-xs text-gray-500 truncate'>
                        {user.profile?.email || ''}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className='py-1'>
                    <button
                      onClick={() => { navigate('/profile'); setdropdownOpen(false) }}
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                        hover:bg-gray-50 border-l-2 border-transparent hover:border-primary transition-all text-left'
                    >
                      <img src={assets.users_icon } className='size-4' alt='' />
                      My profile
                    </button>

                    <button
                      onClick={() => { navigate('/'); setdropdownOpen(false) }}
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                        hover:bg-gray-50 border-l-2 border-transparent hover:border-primary transition-all text-left'
                    >
                      <img src={assets.settings_icon } className='size-4' alt='' />
                      Settings
                    </button>

                    <button
                      onClick={() => { navigate('/my-bookings'); setdropdownOpen(false) }}
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                        hover:bg-gray-50 border-l-2 border-transparent hover:border-primary transition-all text-left'
                    >
                      <img src={assets.calendar_icon} className='size-4' alt='' />
                      My bookings
                    </button>

                    {/* Divider */}
                    <div className='my-1 border-t border-borderColor' />

                    <button
                      onClick={()=>{dispatch(logout())}}
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                        hover:bg-red-50 border-l-2 border-transparent hover:border-red-500 transition-all text-left'
                    >
                      <img src={assets.logouticon} className='size-5 ' alt='' />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            :<button onClick={()=> {setshowlogin(true);navigate("/login")}} className='cursor-pointer bg-primary text-white px-8 py-2
             rounded-xl transition-all hover:bg-primary-dull'>Login</button>}
          </div>
      </div>
        <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={()=>setopen(!open)}>
        <img src={open? assets.close_icon:assets.menu_icon}/>
      </button>
    </div>
  )
}

export default Navbar
