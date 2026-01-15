import React from "react";

function InfoCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />

      {icon && <div className="text-lg">{icon}</div>}

      <div>
        <p className="text-xs md:text-[13px] text-gray-500">{label}</p>
        <p className="text-sm md:text-[15px] text-black font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

export default InfoCard;
