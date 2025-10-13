import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import XSvg from "../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../../utils/api";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get email and otp from location state (passed from signup)
  const email = location.state?.email || "";
  const devOtp = location.state?.otp;

  const { mutateAsync } = useMutation({
    mutationFn: async (otpData) => {
      const res = await fetch("/api/auth/verify-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpData),
      });

      if (!res.ok) throw new Error("OTP verification failed");

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    if (!email) {
      setFormError("Email not found. Please sign up again.");
      setLoading(false);
      return;
    }

    const verifyPromise = (async () => {
      await mutateAsync({ email, otp });
      return true;
    })();

    toast.promise(verifyPromise, {
      loading: "Verifying OTP...",
      success: "Email verified! Redirecting to login...",
      error: (err) => err.message || "Verification failed",
    });

    try {
      await verifyPromise;
      navigate("/login");
    } catch (error) {
      setFormError(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await authAPI.resendSignupOTP(email);
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <XSvg className="w-96 h-96 fill-white" />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          <XSvg className="w-12 h-12 fill-white mb-8 lg:hidden" />
          <h1 className="text-4xl font-bold mb-8">Verify Your Email</h1>
          <p className="text-gray-500 mb-6">
            We've sent a 6-digit OTP to {email}. Enter it below to verify your account.
          </p>
          {devOtp && (
            <p className="text-yellow-500 mb-4 text-center">
              Development mode: Your OTP is <strong>{devOtp}</strong>
            </p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* OTP Input */}
            <label className="twitter-input flex items-center gap-3">
              <MdOutlineMail className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="flex-1 bg-transparent focus:outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full twitter-button py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {formError && <div className="text-red-500 text-center text-sm">{formError}</div>}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Didn't receive the OTP?</p>
            <button
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-blue-500 hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
