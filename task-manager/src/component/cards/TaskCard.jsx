import React from 'react'
import Progress from '../layouts/Progress';
import AvatarGroup from '../input/AvatarGroup'; 
import { LuPaperclip, LuListTodo } from 'react-icons/lu'; 
import moment from 'moment'

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo, 
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-50 border border-cyan-200";
      case "Completed":
        return "text-lime-600 bg-lime-50 border border-lime-200";
      default:
        return "text-violet-600 bg-violet-50 border border-violet-200";
    }
  };
  
  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-600 bg-emerald-50 border border-emerald-200";
      case "Medium":
        return "text-amber-600 bg-amber-50 border border-amber-200";
      default:
        return "text-rose-600 bg-rose-50 border border-rose-200";
    }
  };

  return (
    <div 
      onClick={onClick}
      className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-5"
    >
      {/* --- Header: Status & Priority --- */}
      <div className="flex justify-between items-center">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusTagColor()}`}>
          {status}
        </span>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getPriorityTagColor()}`}>
          {priority} Priority
        </span>
      </div>

      {/* --- Main Body: Title, Desc, Progress --- */}
      <div
        className={`flex flex-col gap-3 pl-4 border-l-[3px] ${
          status === "In Progress" // Fixed case sensitivity to match your Switch statement
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-lime-500"
            : "border-violet-500"
        }`}
      >
        <h3 className='text-base font-bold text-gray-800 line-clamp-1'>{title}</h3>
        <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed'>{description}</p>
        
        {/* Checklist Counter */}
        <div className='flex items-center gap-2 text-xs text-gray-500 font-medium mt-1'>
            <LuListTodo className="text-gray-400 text-sm" />
            <span>Task Done:</span>
            <span className="text-gray-700">
                {completedTodoCount}/{todoChecklist?.length || 0}
            </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-1">
            <Progress progress={progress} status={status} />
        </div>
      </div>

      {/* --- Footer: Dates & Team --- */}
      <div className='grid grid-cols-2 gap-4 items-end border-t border-gray-100 pt-4'>
          
          {/* Left Side: Dates */}
          <div className='flex gap-4'>
              <div className='flex flex-col gap-0.5'>
                  <label className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>Start</label>
                  <p className='text-xs font-semibold text-gray-600'>
                      {moment(createdAt).format("DD MMM")}
                  </p>
              </div>
              <div className='flex flex-col gap-0.5'>
                  <label className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>Due</label>
                  <p className='text-xs font-semibold text-gray-600'>
                      {moment(dueDate).format("DD MMM")}
                  </p>
              </div>
          </div>

          {/* Right Side: Avatar & Attachment */}
          <div className='flex flex-col items-end gap-2'>
              {/* Note: Ensure your AvatarGroup accepts 'avatars' or 'users' based on your previous code */}
              <AvatarGroup users={assignedTo || []} />
              
              {attachmentCount > 0 && (
                  <div className='flex items-center gap-1 text-xs text-gray-400 font-medium'>
                      <LuPaperclip className='text-gray-400' />
                      <span>{attachmentCount} files</span>
                  </div>
              )}
          </div>
      </div>

    </div>
  );
};

export default TaskCard;