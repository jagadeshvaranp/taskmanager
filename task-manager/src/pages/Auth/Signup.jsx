import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../component/layouts/AuthLayout";
import ProfilePhotoSelector from "../../component/input/ProfilePhotoSelector";
import Input from "../../component/input/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import uploadImage from "../../utils/uploadImages";
import { UserContext } from "../../context/userContext";

function Signup() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName) return setError("Please enter full name");
    if (!validateEmail(email)) return setError("Please enter valid email");
    if (!password) return setError("Please enter password");

    let profileImageUrl = "";

    try {
      if (profilePic) {
        const imgRes = await uploadImage(profilePic);
        profileImageUrl = imgRes?.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        role === "admin"
          ? navigate("/admin/dashboard")
          : navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full mt-10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold">Create Account</h3>
        <p className="text-sm text-slate-700 mt-1 mb-6">
          Join us by entering your details
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Full Name"
              placeholder="Jaga"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Email Address"
              placeholder="jaga@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Admin Invite Token"
              placeholder="6 Digit Code"
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button type="submit" className="btn-primary mt-4">
            Sign Up
          </button>

          <p className="text-sm mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
