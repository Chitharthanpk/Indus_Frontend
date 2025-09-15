// src/Modules/LoginPage/index.tsx
import React, { useState } from "react";

import TextInput from "../../CommonComponents/TextInput";
import Button from "../../CommonComponents/Button";
import LoginData from "../../data/logindata.json";
import induslogo from "../../assets/Images/IndusLogo.jpg";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import eaglerobot from "../../assets/Images/Eagle Robot Lab logo color (1).png";

import * as auth from "../../api/auth";
import { getEnrollmentsByEmail } from "../../api/student";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    userId?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // local dev fallback data (not used when real API login used)
  const userData = LoginData;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors: typeof errors = {};

    if (!userId.trim()) formErrors.userId = "User ID is required";
    if (!password.trim()) formErrors.password = "Password is required";

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      // call backend login (stores token & user in localStorage)
      await auth.login(userId.trim().toLowerCase(), password);

      // fetch enrollments for user email
      const email = userId.trim().toLowerCase();
      const enrollments = await getEnrollmentsByEmail(email);

      // persist enrollments and set cookie enrollmentId (legacy behavior)
      localStorage.setItem("enrollments", JSON.stringify(enrollments || []));
      if (Array.isArray(enrollments) && enrollments.length > 0 && enrollments[0].enrollment_id) {
        Cookies.set("enrollmentId", enrollments[0].enrollment_id, { expires: 7 });
      }

      // keep compatibility: store userId in localStorage & cookie
      localStorage.setItem("userId", email);
      Cookies.set("userId", email, { expires: 7 });

      // route (match your App.tsx route)
      navigate("/StudentLearningPathway");
    } catch (err: any) {
      console.error("Login failed:", err);
      // fallback: try the static JSON (dev) login to not block local testing
      const matchedUser = userData.find(
        (user: any) => user.userid === userId && user.password === password
      );
      if (matchedUser) {
        localStorage.setItem("userId", matchedUser.userid);
        localStorage.setItem("enrollments", JSON.stringify([matchedUser]));
        Cookies.set("userId", matchedUser.userid, { expires: 7 });
        Cookies.set("enrollmentId", matchedUser.enrollment_id, { expires: 7 });
        navigate("/StudentLearningPathway");
      } else {
        setErrors({ password: "❌ Invalid credentials or server error" });
      }
    } finally {
      setUserId("");
      setPassword("");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors: typeof errors = {};

    if (!userId.trim()) formErrors.userId = "User ID is required";
    if (!password.trim()) formErrors.password = "New password is required";
    if (!confirmPassword.trim()) formErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    // local dev fallback only
    const userIndex = userData.findIndex((user: any) => user.userid === userId);

    if (userIndex !== -1) {
      alert("✅ Password reset successful!");
      setIsForgotPassword(false);
      setUserId("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setErrors({ userId: "❌ User not found" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-3 sm:px-6 bg-[#a5bdd2]">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Logo */}
        <div className="flex justify-center gap-4 mb-4">
          <img src={induslogo} alt="Indus Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain" />
          <img src={eaglerobot} alt="Indus Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain" />
        </div>

        {/* Title */}
        <div className="flex justify-center items-center">
          <div className="bg-[#e6f6ec] px-3 py-1 text-sm sm:text-md md:text-lg font-semibold inline text-center rounded-sm">
            {isForgotPassword ? "Reset Password" : "Login"}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin} className="space-y-4">
          <TextInput
            label="User ID:"
            value={userId}
            onChange={(e: any) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            errorMessage={errors.userId}
            className="w-full text-sm sm:text-base"
          />

          {!isForgotPassword && (
            <TextInput
              label="Password:"
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              placeholder="Enter your password"
              errorMessage={errors.password}
              className="w-full text-sm sm:text-base"
            />
          )}

          {isForgotPassword && (
            <>
              <TextInput
                label="New Password:"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="Enter new password"
                errorMessage={errors.password}
                className="w-full text-sm sm:text-base"
              />

              <TextInput
                label="Confirm Password:"
                type="password"
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                errorMessage={errors.confirmPassword}
                className="w-full text-sm sm:text-base"
              />
            </>
          )}

          <div className="w-full">
            <Button bgColor="bg-[#a5bdd2]" textColor="text-black" size="lg" className="w-full text-sm sm:text-base">
              {isForgotPassword ? "Reset Password" : "Login"}
            </Button>
          </div>

          {!isForgotPassword && (
            <>
              <div className="text-[#93cfeb] font-semibold text-center text-xs sm:text-sm md:text-base">
                If Not Registered, Contact ERL Team
              </div>
              <div
                className="text-red-500 font-semibold text-center text-xs sm:text-sm md:text-base cursor-pointer"
                onClick={() => setIsForgotPassword(true)}
              >
                Forget Password?
              </div>
            </>
          )}

          {isForgotPassword && (
            <div
              className="text-blue-500 font-semibold text-center text-xs sm:text-sm md:text-base cursor-pointer"
              onClick={() => setIsForgotPassword(false)}
            >
              🔙 Back to Login
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
