import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/services";
import useUiStore from "../context/uiStore";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setSubmitted(true);
      showToast("Password reset successfully!", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
        "error",
      );
    } finally {
      setLoading(false);
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
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Create New Password
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Password Reset!
                  </p>
                </div>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully. You can now log in
                  with your new password.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                      minLength={6}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm password"
                      minLength={6}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Note:</strong> This link expires in 1 hour. If it has
            expired, request a new one.
          </p>
        </div>
      </div>
    </div>
  );
}
