import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import useAuthStore from "../context/authStore";
import useUiStore from "../context/uiStore";
import { authService } from "../services/services";
import { validateEmail, validatePassword } from "../utils/helpers";
import { useForm } from "../hooks/useForm";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showToast } = useUiStore();
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (values) => {
    const errors = {};
    if (!values.name.trim()) errors.name = "Name is required";
    if (!validateEmail(values.email)) errors.email = "Valid email is required";
    if (!validatePassword(values.password))
      errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const { data } = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setUser(data.user, data.token);
      showToast("Registration successful!", "success");
      navigate("/dashboard");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Registration failed",
        "error",
      );
    }
  };

  const {
    values,
    isSubmitting,
    handleChange,
    handleSubmit: formSubmit,
    errors,
    touched,
  } = useForm({ name: "", email: "", password: "" }, handleSubmit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">📝 Todo App</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <form onSubmit={formSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={values.name}
            onChange={handleChange}
            error={formErrors.name}
            touched={true}
          />

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
            {isSubmitting ? <Spinner size="sm" /> : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
