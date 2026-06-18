import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import type { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import { updateUser } from '../../store/user/userSlice';
import ToastMessage from "../../component/Toast/ToastMessage";
import { MessageType } from "../../Data/AppEnum";

const IMAGE_FILE_SIZE = 2 * 1024 * 1024
const IMAGE_MIMETYPE = ['image/jpg','image/jpeg','image/png']
const Sidebar = () => {
  const location = useLocation();
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const profile = useSelector((state: RootState) => state.user.profile);
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if(profile?.profile_image){
      const hostedImage =profile?.profile_image
      setProfileImg(hostedImage)
    }
  }, [])
  
  // Helper function to check if route is active
  const isActive = (path: string) => {
    return location.pathname === path
  }
  const handleupload = async(e:any)=>{
    const file = e.target.files?.[0];
      if (!file) return;
      if(!IMAGE_MIMETYPE.includes(file.type))
      {
                ToastMessage(MessageType.Error,"Only JPG, JPEG and PNG images are allowed");
        return;
      }
      if(file.size > IMAGE_FILE_SIZE){
                        ToastMessage(MessageType.Error,"File size must be less than 2MB");
      return;
      }
      
      const url = URL.createObjectURL(file);
      setProfileImg(url);
      const formData = new FormData()
      formData.append("profileimage",file);
      try{
      const response = await axiosInstance.post('/upload',formData)
      const img_path = response.data.data.imagePath

      const hostedImage =  img_path;
      setProfileImg(hostedImage)
      const data={
        name:profile?.name,
        email:profile?.email,
        profile_image:img_path,
        phone_no:profile?.phone_no
      }
      await axiosInstance.put('/profile',data)
       dispatch(updateUser({ name:profile?.name || '',
        email:profile?.email || '',
        profile_image:img_path,
        phone_no:profile?.phone_no|| ''}))
    }
      catch(e:any)
      {
        const statuscode = e.response.status;
        if(statuscode === 400)
        {
        ToastMessage(MessageType.Error,e.response.data.message);
        }
        else if(statuscode === 404)
        {
        ToastMessage(MessageType.Error,e.response.data.message);
        }else if(statuscode === 401){

        }
        else{
                  ToastMessage(MessageType.Error,"Server Error try again later");
        }
      }
      e.target.value = "";
  }

  const menuItems = [
    { name: 'Dashboard', path: '/owner', icon:assets.dashboardIcon, coloredIcon: assets.dashboardIconColored },
    { name: 'Add Car', path: '/owner/add-car', icon: assets.addIcon, coloredIcon: assets.addIconColored },
    { name: 'Manage Cars', path: '/owner/manage-cars', icon: assets.carIcon, coloredIcon: assets.carIconColored },
    { name: 'Manage Bookings', path: '/owner/manage-bookings', icon: assets.listIcon, coloredIcon: assets.listIconColored },
  ]

  return (
    <div className='w-full max-w-3xs max-md:max-w-fit bg-white border-r border-borderColor h-screen flex flex-col sticky top-0'>
      {/* Profile Section */}
     <div className='flex flex-col items-center mb-6 py-5 max-md:mb-3 border-b border-gray-200 gap-3'>
  
  {/* Hidden file input */}
  {/* <input
    type="file"
    id="profile-upload"
    accept="image/*"
    className="hidden"
    onChange={handleupload}
  /> */}

  {/* Clickable avatar */}
  <label
    htmlFor="profile-upload"
    className="relative cursor-pointer group"
    aria-label="Change profile picture"
  >
    <img
      src={profileImg || assets.user_profile}
      alt='Profile'
      className='size-19 rounded-full object-cover max-md:size-10'
    />
    {/* Hover overlay */}
    {/* <div className='absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
      <img src={assets.edit_icon} alt="Edit" className='size-5' />
    </div> */}
  </label>

  <h2 className='text-xl font-bold text-gray-800 max-md:hidden'>{profile?.name}</h2>
</div>

      {/* Navigation Menu */}
      <nav className='flex flex-col'>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 transition-all border-r-4 ${
              isActive(item.path)
                ? 'bg-blue-100 text-blue-600 font-semibold border-r-blue-600'
                : 'text-gray-600 hover:bg-gray-100 border-r-transparent'
            }`}
          >
           <img  src={isActive(item.path) ? item.coloredIcon : item.icon} alt={item.name} />
            <span className='max-md:hidden'>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
