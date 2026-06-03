import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { authService } from "../services/services";
import useAuthStore from "../context/authStore";
import useUiStore from "../context/uiStore";

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("Password changed successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to change password. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "security"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Security
            </button>
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {user?.name}
                    </h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Name cannot be changed currently
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed currently
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Lock className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Protect your account by changing your password regularly
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter your current password"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter your new password"
                        minLength={6}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
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
                        placeholder="Confirm your new password"
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
                    {loading ? "Changing Password..." : "Change Password"}
                  </button>
                </form>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Use a strong password with a mix of
                    uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
