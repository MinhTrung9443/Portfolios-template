import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api";

function VerifyOtp({ setIsAuthenticated }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.verifyOtp({ email, otp });
      const { accessToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    try {
      await authAPI.resendOtp(email);
      setError("");
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to your email: <span className="font-semibold">{email}</span>
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
              OTP Code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleChange}
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {resendDisabled ? "Resend OTP in 60s" : "Resend OTP"}
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600">
          <Link to="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
