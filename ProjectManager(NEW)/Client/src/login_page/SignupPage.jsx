import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBackToLanding = () => navigate("/");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-white font-poppins p-6 relative">
      <button
        className="absolute top-5 left-5 px-4 py-2 bg-indigo-600 text-white font-bold rounded shadow-md hover:opacity-90 hover:scale-105 hover:bg-indigo-800 transition-transform"
        onClick={handleBackToLanding}
      >
        Landing Page
      </button>

      {/* Form Container */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-black">
        <h2 className="text-2xl font-semibold text-center mb-2">Create an Account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sign up to get started
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          {["username", "email", "password"].map((field) => (
            <div className="mb-4" key={field}>
              <label htmlFor={field} className="block text-black font-semibold mb-1 capitalize">
                {field}:
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {error && <div className="text-red-500 text-sm text-center mb-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-800"} text-white p-3 rounded font-medium transition-transform transform hover:scale-105`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <div className="flex items-center my-4 w-full">
          <hr className="flex-grow border-t-2 border-gray-400" />
          <span className="px-2 text-gray-600">Or</span>
          <hr className="flex-grow border-t-2 border-gray-400" />
        </div>

        <p className="text-gray-700 text-center">
          Already have an account?
          <button
            className="ml-1 text-blue-600 font-bold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;