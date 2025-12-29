import React, { useState, useContext } from "react";
import AuthLayout from "../../component/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../component/input/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import { UserContext } from "../../context/userContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext); // ✅ FIX
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        updateUser(response.data); // ✅ FIX (no manual localStorage)

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center mx-auto p-4">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your login details
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="jaga@example.com"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Min 8 characters"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="btn-primary mt-2">
            Login
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don&apos;t have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
