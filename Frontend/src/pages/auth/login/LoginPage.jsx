import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth.js";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🔥 Show loading → then success/error automatically
    const loginPromise = login(formData);

    toast.promise(
      loginPromise,
      {
        loading: "Signing in...",
        success: "Login successful!",
        error: (err) => err.message || "Login failed",
      },
      {
        id: "login-toast", // ensures only one toast at a time
      }
    );

    try {
      await loginPromise;
      navigate("/");
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <XSvg className="w-96 h-96 fill-white" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          <XSvg className="w-12 h-12 fill-white mb-8 lg:hidden" />
          <h1 className="text-4xl font-bold mb-8">Sign in to Twitter</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="twitter-input flex items-center gap-3">
                <MdOutlineMail className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                  required
                />
              </label>
            </div>

            <div>
              <label className="twitter-input flex items-center gap-3">
                <MdPassword className="w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full twitter-button py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="loading-spinner w-5 h-5"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            {error && (
              <div className="text-red-500 text-center text-sm">{error}</div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Don't have an account?</p>
            <Link to="/signup">
              <button className="w-full twitter-button-outline py-3 text-lg font-semibold">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
