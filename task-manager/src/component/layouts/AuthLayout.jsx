import React from 'react'
import UI_IMG from '../../assets/image/auth-img.png'
function AuthLayout({ children }) {
  return (
    <div className='flex'>
        <div  className=' w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'>Task Manager</h2>
            {children}
        </div>

        <div className='hidden md:flex w-[40vw] h-screen' >
            <img src={UI_IMG} alt=""  className=''/>
        </div>
    </div>
  )
}

export default AuthLayout
