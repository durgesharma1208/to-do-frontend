import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "../services/services";
import Toast from "../components/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setToastMessage("Please enter your email");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSubmitted(true);
      setToastMessage("Reset email sent successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      );
      setToastType("error");
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center rounded-t-lg">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          </div>

          {/* Content */}
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-4">
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">✓ Email Sent!</p>
                </div>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to <strong>{email}</strong>.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  The link will expire in 1 hour. Please check your inbox and
                  spam folder.
                </p>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft size={18} />
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-center mb-6">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Check your spam folder if you don't see the
            email within a few minutes.
          </p>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
