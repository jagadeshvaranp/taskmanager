import React from "react";

const getInitials = (name) => {
  if (!name) return "?";
  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

const AvatarGroup = ({ users = [], maxVisible = 3 }) => {
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="flex items-center">
      {safeUsers.slice(0, maxVisible).map((user, index) => {
        // Handle User Object vs String
        let imgSrc = "";
        let displayName = "";

        if (typeof user === "string") {
          imgSrc = user;
          displayName = `User ${index + 1}`;
        } else {
          // Check for profileImageUrl, photo, or image keys
          imgSrc = user?.profileImageUrl || user?.photo || user?.image || null;
          displayName = user?.fullName || user?.name || `User ${index + 1}`;
        }

        return (
          <div 
            key={index} 
            className="-ml-3 first:ml-0 transition-transform hover:-translate-y-1 relative group"
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={displayName}
                title={displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-white ring-1 ring-gray-100 bg-gray-200"
              />
            ) : (
              // Fallback to Initials if image is missing
              <div 
                title={displayName}
                className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white ring-1 ring-gray-100 flex items-center justify-center text-xs font-bold text-slate-600"
              >
                {getInitials(displayName)}
              </div>
            )}
          </div>
        );
      })}

      {/* Count Badge for extra users */}
      {safeUsers.length > maxVisible && (
        <div className="w-9 h-9 flex justify-center items-center bg-blue-100 text-blue-600 text-xs font-bold rounded-full border-2 border-white ring-1 ring-blue-50 -ml-3 z-10">
          +{safeUsers.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;