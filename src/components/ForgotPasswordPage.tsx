// // /src/components/Auth/ForgotPasswordPage.tsx
// import React, { useState } from "react";
// import { apiService } from "../services/api";

// const ForgotPasswordPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await apiService.forgotPassword({ email });
//       setMessage("Reset link has been sent to your email.");
//     } catch (err) {
//         console.log(err)
//       setError("Failed to send reset link. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//         />
//         <button type="submit">Send Reset Link</button>
//       </form>
//       {message && <div>{message}</div>}
//       {error && <div>{error}</div>}
//     </div>
//   );
// };

// export default ForgotPasswordPage;

// /src/components/Auth/ForgotPasswordPage.tsx
import React, { useState } from "react";
import { apiService } from "../services/api";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.forgotPassword({ email });
      setMessage("Reset link has been sent to your email.");
    } catch (err) {
        console.log(err)
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
          Forgot Password
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
          Enter your email address to receive a reset link.
        </p>

        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-slate-50 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
