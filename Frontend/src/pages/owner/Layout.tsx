import { Outlet } from "react-router-dom"
import NavbarOwner from "../../component/owner/NavbarOwner"
import Sidebar from "../../component/owner/Sidebar"

const Layout = () => {
  return (
    <>
        <NavbarOwner/>
        <div className="flex ">
            <Sidebar/>
            <div className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-10">
                <Outlet />
            </div>
        </div>
    </>
  )
}

export default Layout
