
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { apiService } from "../services/api";

// const ResetPasswordPage: React.FC = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [error, setError] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const token = new URLSearchParams(location.search).get("token");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) {
//       setError("Invalid token");
//       return;
//     }

//     try {
//       await apiService.resetPassword({ token, newPassword });
//       navigate("/login");
//     } catch (err) {
//         console.log(err)
//       setError("Failed to reset password. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
//       <div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">Reset Password</h1>
//         <p className="text-center text-slate-600 dark:text-slate-400 mb-6">Enter your new password to reset it.</p>

//         {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
//             <input
//               type="password"
//               id="newPassword"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               className="w-full p-3 bg-slate-50 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
//               placeholder="Enter your new password"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { Eye, EyeOff } from "lucide-react"; // You can use any icon library that provides these

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid token");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await apiService.resetPassword({ token, newPassword });
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">Reset Password</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6">Enter your new password to reset it.</p>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="Enter your new password"
              />
              <span 
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="text-slate-500" /> : <Eye className="text-slate-500" />}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="Confirm your new password"
              />
              <span 
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="text-slate-500" /> : <Eye className="text-slate-500" />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
