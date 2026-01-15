import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
const SelectDropdown = ({ label, value, onChange, options,placeholder}) => {
      const [isOpen,setIsOpen]=useState(false)

      const handleSelecter=(option)=>{
        onChange(option)
        setIsOpen(false)
      }
  return <div className="relative w-full ">
        <button className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md flex justify-between items-center"
        onClick={()=>setIsOpen(!isOpen)}>
          {
            value ? options.find((opt)=>opt.value === value)?.label :placeholder
          }
          <span className="ml-2"> {isOpen ? <LuChevronDown className=" " /> : <LuChevronDown />}</span>
        </button>

        {isOpen && (
          <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10 shadow-md">
            {options.map((option)=>(
              <div key={option.value} onClick={()=>handleSelecter(option.value)} className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-200"> 
                {option.label}
                
              </div>
            ))}
          </div>
        )}
  </div>
};

export default SelectDropdown;