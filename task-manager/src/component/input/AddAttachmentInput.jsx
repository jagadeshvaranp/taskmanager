import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2'
import { LuPaperclip } from 'react-icons/lu'

function AddAttachmentInput({ attachments, setAttachment }) {
  const [option, setOption] = useState("")

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachment([...attachments, option.trim()])
      setOption("")
    }
  }

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index)
    setAttachment(updatedArr)
  }

  return (
    <div className='flex flex-col gap-2'>
      {/* List of Attachments */}
      {attachments.map((item, index) => (
        <div key={index} className='group flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all'>
          <div className='flex items-center gap-2.5 w-full overflow-hidden'>
            <div className='w-7 h-7 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm flex-shrink-0'>
                <LuPaperclip className='text-slate-500 text-xs'/>
            </div>
            <p className='text-xs text-slate-700 font-medium truncate'>{item}</p>
          </div>
          
          <button 
            className='text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100' 
            onClick={() => handleDeleteOption(index)}
          >
              <HiOutlineTrash className='text-lg' />
          </button>
        </div>
      ))}

      {/* Input Field */}
      <div className='flex items-center gap-2 mt-1'>
        <div className='flex-1 flex items-center gap-2 px-3 py-4 border border-slate-200 rounded-lg bg-white   transition-all '>
            <LuPaperclip className='text-slate-400' />
            <input
            type='text'
            placeholder='Add File Link'
            value={option}
            onChange={({ target }) => setOption(target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
            className='w-full text-xs outline-none text-gray-700 placeholder:text-slate-400 bg-transparent'
            />
        </div>
        
        <button 
            onClick={handleAddOption}
            className='card-btn text-nowrap'
        >
            <HiMiniPlus className='text-xl' />
        </button>
      </div>      
    </div>
  )
}

export default AddAttachmentInput