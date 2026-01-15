import React from 'react';
import moment from 'moment';

function TaskListTable({ tableData }) {
  
  const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-500 border border-green-200";
    case "Pending":
      return "bg-purple-100 text-purple-500 border border-purple-200";
    case "In Progress":
      return "bg-cyan-100 text-cyan-500 border border-cyan-200";
    default:
      return "bg-gray-100 text-gray-500 border border-gray-200";
  }
};

 const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-500 border border-red-200";
    case "Medium":
      return "bg-orange-100 text-orange-500 border border-orange-200";
    case "Low":
      return "bg-green-100 text-green-500 border border-green-200";
    default:
      return "bg-gray-100 text-gray-500 border border-gray-200";
  }
};

  

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              priority
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              created On
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {tableData.map((task, index) => (
            <tr key={task._id || index} className="hover:bg-gray-50 transition-colors">
              
              {/* Title Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {task.title}
                </div>
              </td>

              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-semibold p-2 border rounded-2xl ${getStatusBadgeColor(task.status)}`}>
                  {task.status}
                </span>
              </td>

              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>

              {/* Date Column (Using moment to format) */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                { task.createdAt ? moment(task.createdAt).format("MMM Do, YYYY") : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskListTable;