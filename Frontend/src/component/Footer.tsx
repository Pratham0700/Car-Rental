import { assets } from '../assets/assets'

const Footer = () => {
  return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500 '>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
                <div>
                    <div className='flex flex-row items-center gap-2 pb-4'>
                        <img src={assets.favicon} alt="logo" className='h-10 w-10'/>
                        <p className='font-semibold text-3xl text-gray-800'>Wheeler</p>
                    </div>
                    <p className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href="#"><img src={assets.facebook_logo} alt="facebook logo"  className='w-5 h-5'/></a>
                        <a href="#"><img src={assets.instagram_logo} alt="instagram logo"  className='w-5 h-5'/></a>
                        <a href="#"><img src={assets.twitter_logo} alt="twitter logo"  className='w-5 h-5'/></a>
                        <a href="#"><img src={assets.gmail_logo} alt="gmail logo"  className='w-5 h-5'/></a>
                    </div>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="/">Home</a></li>
                        <li><a href="/cars">Browse Car</a></li>
                        <li><a href="/my-bookings">My Bookings</a></li>
                        <li><a href="/owner/dashboard">List Your Car</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">123 Galaxy Business Park</a></li>
                        <li><a href="#">Ahmedabad, Gujarat 380054</a></li>
                        <li><a href="#">+91 12345 67890</a></li>
                        <li><a href="#">wheeler@example.com</a></li>
                    </ul>
                </div>
                
            </div>
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li>|</li>
                    <li><a href="#">Terms</a></li>
                    <li>|</li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer
