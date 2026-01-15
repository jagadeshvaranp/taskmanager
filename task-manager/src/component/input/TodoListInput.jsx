import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

function TodoListInput({ todoList, setTodoList }) {
  const [option, setOption] = useState("");

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updateArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updateArr);
  };

  return (
    <div className="space-y-3">
      
      {todoList.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-2 border rounded bg-gray-50">
          <p className="flex items-center gap-2">
            <span className="font-bold text-gray-500">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>
          
          <button
            className="text-red-500 hover:text-red-700 p-1"
            onClick={() => handleDeleteOption(index)} 
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>
      ))}
 
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Enter task"
          value={option}
          onChange={({ target }) => setOption(target.value)} 
          className="flex-1 p-2 border rounded outline-none border-gray-100 focus:border-gray-500"
        />
        
        
        <button 
          onClick={handleAddOption}
          className="card-btn text-nowrap"
        >
          <HiMiniPlus className="w-5 h-5 text-lg" />
          Add
        </button>
      </div>
    </div>
  );
}

export default TodoListInput;