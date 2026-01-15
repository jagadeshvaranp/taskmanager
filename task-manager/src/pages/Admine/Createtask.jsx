import React, { useState } from 'react'
import DashboardLayout from '../../component/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance  from '../../utils/axiosintance'
import { API_PATHS } from '../../utils/Apipaths'
import toast from 'react-hot-toast'
import { useLocation,useNavigate } from 'react-router-dom'
import moment from 'moment'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropdown from '../../component/input/SelectDropdown'
import SelectUser from '../../component/input/SelectUser'
import TodoListInput from '../../component/input/TodoListInput'
import AddAttachmentInput from '../../component/input/AddAttachmentInput'
function Createtask() {

  const location = useLocation()
  const {taskId}=location.state || {}
  const navigate = useNavigate()

  const [taskData,setTaskData]=useState({
    title:"",
    description:"",
    priority:"",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attacments:[],
  })

  const [currentTask,setcurrentTask]=useState(null)
  const [error,setError]=useState("")
  const [loading,setLoading]=useState(false)
  const [openDeleteAlert,setOpenDeleteAlert]=useState(false)
  const handlevalueChange = (key,value)=>{
    setTaskData((prevData)=>({...prevData,[key]:value}))
  }
  const clearData = ()=>{
    setTaskData({
    title:"",
    description:"",
    priority:"Low",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attacments:[],
    })
  }

  //create a task
  const createTask = async()=>{

  }

  //update task
  const updateTask = async ()=>{

  }

  //get task info by id
  const getTaskDetailsByID=async ()=>{

  }

  //delete task
  const deleteTask = async()=>{

  }
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
         <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
              <div className='form-card col-span-3'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl md:text-xl font-medium'>
                          {taskId ? "Update Task" : "Create Task"}
                        </h2>
                        {
                          taskId && (
                            <button 
                            className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounder px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                            onClick={()=>setOpenDeleteAlert(true)}
                            >
                              <LuTrash2 className='text-base' />Delete
                            </button>
                          )
                        }
                    </div>
                    <div className='mt-4'>
                          <label className='text-xs font-medium text-slate-600'>
                            Task Title
                          </label>
                          <input
                          placeholder='Create app UI'
                          className='form-input'
                          value={taskData.title}
                          onChange={({target})=>
                            handlevalueChange("title",target.value)
                          } 
                          />
                    </div>
                    <div className='mt-3'>
                      <label className='text-xs font-medium text-slate-600'>
                        Description
                      </label>
                          <textarea 
                          placeholder='Describe task'
                          className='form-input'
                          rows={4}
                          value={taskData.description}
                          onChange={({target})=>{
                            handelvalueChange("description",target.value)
                          }}
                          />
                    </div>
                    <div className='grid grid-cols-12 gap-4 mt-3'>
                          <div className='col-span-6 md:col-span-4'>
                            <label className='text-xs font-medium text-slate-600'>Priority</label>
                              <SelectDropdown 
                              options={PRIORITY_DATA}
                              value={taskData.priority}
                              onChange={(value)=>handlevalueChange("priority",value)}
                              placeholder="select priority"
                              />
                          </div>
                          {/* date */}
                          <div className='col-span-6 md:col-span-4'>
                            <label className='text-xs font-medium text-slate-600'>
                              Due Date
                            </label>
                            <input 
                            placeholder='create app ui'
                            className='form-input'
                            value={taskData.dueDate}
                            onChange={({target})=>handlevalueChange("dueDate",target.value)}
                            type='date'
                            ></input>
                          </div>

                          <div className='col-span-12 md:col-span-3'>
                              <label className='text-xs font-medium text-slate-600 '>
                                Assign To
                              </label>

                              <SelectUser 
                              selectedUsers={taskData.assignedTo || ""}
                              setSelectedUsers={(value)=>{
                                handlevalueChange("assignedTo",value)
                              }}

                              />
                          </div>
                    </div>

                    <div className='mt-3'>
                      <label className='text-xs font-medium text-slate-600'>
                        ToDo Checklist
                      </label>
                      <TodoListInput 
                       todoList={taskData ?. todoChecklist}
                      setTodoList={(value)=>
                        handlevalueChange("todoChecklist",value)
                      }
                      />
                    </div>

                    <div className='mt-3'>
                          <label className='text-xs font-medium text-slate-600'>Add Attachment</label>
                          <AddAttachmentInput attacments={taskData?.attacments} setAttachment={(value)=>handlevalueChange("attachments",value)}/>
                    </div>
              </div>
         </div>
      </div>
     
    
     
    </DashboardLayout>

    
  )
}

export default Createtask
