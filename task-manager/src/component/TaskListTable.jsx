import React from 'react';
import moment from 'moment';

function TaskListTable({ tableData = [] }) { // Default to empty array to prevent crash
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-600 border border-emerald-200"; // Changed green to emerald for better contrast
      case "Pending":
        return "bg-amber-100 text-amber-600 border border-amber-200"; // Pending usually implies waiting (Amber/Orange)
      case "In Progress":
        return "bg-blue-100 text-blue-600 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-orange-600 bg-orange-50";
      case "Low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="overflow-x-auto mb-4 bg-white rounded-lg shadow-sm border border-gray-200 mt-5">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created On
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.length > 0 ? (
            tableData.map((task, index) => (
              <tr key={task._id || index} className="hover:bg-gray-50 transition-colors">
                
                {/* Title Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {task.title || "No Title"}
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>

                {/* Priority Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>

                {/* Date Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {task.createdAt ? moment(task.createdAt).format("MMM Do, YYYY") : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskListTable;