import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Input({ type, placeholder, label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="text-[14px] text-slate-800">{label}</label>

      <div className="input-box">
        <input
          type={
            type === "password"
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none"
        />

        {type === "password" && (
          showPassword ? (
            <FaRegEye
              size={20}
              className="cursor-pointer text-primary"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaRegEyeSlash
              size={20}
              className="cursor-pointer text-slate-400"
              onClick={() => setShowPassword(true)}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Input;
