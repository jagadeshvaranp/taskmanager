import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data'

function SideMenu({activeMenu}) {
    const{user,clearUser}=useContext(UserContext)
    const [sideMenuData,setsideMenuData]=useState([])
    const navigate = useNavigate()

    const handlelick =(route)=>{
        if(route==="logout"){
            handelLougout()
            return;
        }
        navigate(route)
    }

    const handelLougout=()=>{
        localStorage.clear()
        clearUser()
        navigate("/login")
    }

    useEffect(()=>{
        if(user){
            setsideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
            
        }
        return ()=>{}
    },[user])


    return <div className='w-64 h-[calc (100vh-61px)] bg-white border-gray-200/5 sticky  top-[61px] z-20' >
            <div className=' flex flex-col items-center justify-center mb-7 pt-5'>
                <div className='relative'>
                    <img src={user?.profileImageUrl || ""} alt="profile image" className='w-20 h-20 bg-slate-400 rounded-full' />
                </div>
                {
                    user?.role === "admin" && (
                        <div className='text-[10px] font-medium  text-white bg-primary px-4 py-0.6 rounded mt-1'>
                            Admin
                        </div>
                    )
                }

                <h5 className='text-gray-950 font-medium leading-6  mt-3'>{user?.name || ""}</h5>

                <p className='text-[12px] text-gray-500'>{user?.email || ""}</p>

            </div>

            {sideMenuData.map((item, index) => (
  <button
    key={`menu_${index}`}
    className={`w-full flex items-center gap-4 text-[15px]
      ${
        activeMenu === item.label
          ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-3"
          : ""
      }
      py-3 px-6 mb-3 cursor-pointer`}
    onClick={() => handleClick(item.path)}
  >
    <item.icon className="text-lg" />
    {item.label}
  </button>
))}

    </div>
 
}

export default SideMenu
