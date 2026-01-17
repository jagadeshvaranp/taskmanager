import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext' // Adjust path as needed
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data' // Adjust path as needed

function SideMenu({ activeMenu }) {
    const { user, clearUser } = useContext(UserContext)
    const [sideMenuData, setSideMenuData] = useState([])
    const navigate = useNavigate()

    // Logic to switch menu based on role
    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
        }
    }, [user])

    const handleLogout = () => {
        // 1. Clear Local Storage
        localStorage.clear() 
        
        // 2. Clear Context State
        clearUser() 
        
        // 3. Redirect to Login
        navigate("/login") 
    }

    const handleClick = (route) => {
        // Check if the route is the special "logout" string defined in data.js
        if (route === "logout") {
            handleLogout()
            return;
        }
        
        // Otherwise, navigate to the route normally
        navigate(route)
    }

    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200 sticky top-[61px] z-20 flex flex-col'>
            
            {/* User Profile Section */}
            <div className='flex flex-col items-center justify-center mb-7 pt-5'>
                <div className='relative'>
                    <img 
                        src={user?.profileImageUrl || "https://via.placeholder.com/150"} 
                        alt="profile" 
                        className='w-20 h-20 object-cover bg-slate-400 rounded-full' 
                    />
                </div>
                
                {user?.role === "admin" && (
                    <div className='text-[10px] font-medium text-white bg-blue-600 px-3 py-1 rounded-full mt-2'>
                        Admin
                    </div>
                )}

                <h5 className='text-gray-950 font-medium leading-6 mt-3'>
                    {/* UPDATED: Checks for fullName, OR name, before defaulting to "User" */}
                    {user?.fullName || user?.name || "User"}
                </h5>

                <p className='text-[12px] text-gray-500'>
                    {user?.email || ""}
                </p>
            </div>

            {/* Menu Items */}
            <div className='flex flex-col flex-1'>
                {sideMenuData.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        onClick={() => handleClick(item.path)}
                        className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-1 transition-colors duration-200 border-r-4
                            ${activeMenu === item.label
                                ? "text-blue-600 bg-blue-50 border-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-transparent"
                            }
                        `}
                    >
                        {/* Render the icon component */}
                        {item.icon && <item.icon className="text-xl" />}
                        
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SideMenu