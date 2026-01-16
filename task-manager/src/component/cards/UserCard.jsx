import React from 'react';

// Helper to get initials (e.g., "John Doe" -> "JD")
const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

function UserCard({ userInfo }) {
  
  // DEBUG: Check your console to see what field names your backend is actually sending!
  // It might be 'pending', 'todo', 'tasks_count', etc.
  console.log("User Data for " + userInfo?.name, userInfo);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar Logic */}
          {userInfo?.profileImageUrl ? (
            <img
              src={userInfo?.profileImageUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
              {getInitials(userInfo?.name)}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-slate-800">{userInfo?.name || "Unknown User"}</p>
            <p className="text-xs text-slate-500">{userInfo?.email || "No Email"}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        {/* PENDING / TODO */}
        <StatCard
          label="Pending"
          // We check multiple common names just in case
          count={userInfo?.PendingTasks ?? userInfo?.pending ?? 0} 
          status="Pending"
        />
        
        {/* IN PROGRESS */}
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks ?? userInfo?.inProgress ?? 0}
          status="In Progress"
        />
        
        {/* COMPLETED */}
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks ?? userInfo?.completed ?? 0}
          status="Completed"
        />
      </div>
    </div>
  );
}

const StatCard = ({ label, count, status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-50 border-orange-100";
      case "In Progress":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "Completed":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md border ${getStatusStyle()}`}
    >
      {/* Ensure count is rendered even if it is 0 */}
      <span className="text-lg font-bold">{count}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-80">{label}</span>
    </div>          
  );
};

export default UserCard;