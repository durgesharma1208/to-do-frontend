import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import useAuthStore from "../context/authStore";
import useUiStore from "../context/uiStore";
import { authService } from "../services/services";
import { validateEmail } from "../utils/helpers";
import { useForm } from "../hooks/useForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showToast } = useUiStore();
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (values) => {
    const errors = {};
    if (!validateEmail(values.email)) errors.email = "Valid email is required";
    if (!values.password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const { data } = await authService.login({
        email: values.email,
        password: values.password,
      });

      setUser(data.user, data.token);
      showToast("Login successful!", "success");
      navigate("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "error");
    }
  };

  const {
    values,
    isSubmitting,
    handleChange,
    handleSubmit: formSubmit,
  } = useForm({ email: "", password: "" }, handleSubmit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">📝 Todo App</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={formSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={values.email}
            onChange={handleChange}
            error={formErrors.email}
            touched={true}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••"
            value={values.password}
            onChange={handleChange}
            error={formErrors.password}
            touched={true}
          />

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Register
          </a>
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Account:</strong> demo@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
