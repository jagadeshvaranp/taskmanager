import React from "react";

const AvatarGroup = ({avatars,maxVisible}) => {
  return (
  <div className="flex items-center">
  {avatars.slice(0, maxVisible).map((avatar, index) => (
    <img 
      key={index} 
      src={avatar} 
      alt={`Avatar ${index}`} 
      className="w-9 h-9 rounded-xl object-cover -ml-3 border-2 border-white ring-1 ring-gray-100 first:ml-0 transition-transform hover:-translate-y-1" 
    />
  ))}
  
  {avatars.length > maxVisible && (
    <div className="w-9 h-9 flex justify-center items-center bg-blue-100 text-blue-600 text-xs font-bold rounded-xl border-2 border-white ring-1 ring-blue-50 -ml-3">
      +{avatars.length - maxVisible}
    </div>
  )}
</div>
  );
};

export default AvatarGroup;