import { useState, useEffect } from "react";
import { CheckCircle, Mail, AlertCircle } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/services";
import useUiStore from "../context/uiStore";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      setLoading(true);
      try {
        await authService.verifyEmail(token);
        setVerified(true);
        setError(false);
        setTimeout(() => navigate("/login"), 3000);
      } catch {
        setError(true);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleResendEmail = async () => {
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    setResending(true);
    try {
      await authService.resendVerificationEmail({ email });
      showToast("Verification email sent!", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to resend verification email",
        "error",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center rounded-t-lg">
            <div className="flex justify-center mb-4">
              {loading ? (
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-spin">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              ) : verified ? (
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {loading
                ? "Verifying Email..."
                : verified
                  ? "Email Verified!"
                  : "Verification Failed"}
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Please wait while we verify your email...
                </p>
              </div>
            ) : verified ? (
              <div className="text-center py-8">
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    ✓ Your email has been verified successfully!
                  </p>
                </div>
                <p className="text-gray-600 mb-4">
                  You can now log in to your account. Redirecting you to the
                  login page...
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">
                    ✗ The verification link has expired or is invalid.
                  </p>
                </div>
                <p className="text-gray-600 mb-6">
                  Please request a new verification email.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {resending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
