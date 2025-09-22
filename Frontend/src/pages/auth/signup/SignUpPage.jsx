import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(formData);
      navigate("/login");
    } catch (error) {
      setError(error.message || "Signup failed");
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

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          <XSvg className="w-12 h-12 fill-white mb-8 lg:hidden" />
          <h1 className="text-4xl font-bold mb-8">Join Twitter today</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="twitter-input flex items-center gap-3">
                <MdOutlineMail className="w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="twitter-input flex items-center gap-3">
                  <FaUser className="w-5 h-5 text-gray-500" />
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
                  <MdDriveFileRenameOutline className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Full Name"
                    name="fullname"
                    onChange={handleInputChange}
                    value={formData.fullname}
                    required
                  />
                </label>
              </div>
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
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>

            {error && (
              <div className="text-red-500 text-center text-sm">{error}</div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Already have an account?</p>
            <Link to="/login">
              <button className="w-full twitter-button-outline py-3 text-lg font-semibold">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
