import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackToLanding = () => navigate("/");

  const validateInputs = () => {
    if (isSignup && !username.trim()) return "Username is required";
    if (!email.trim()) return "Email is required";
    if (!password.trim()) return "Password is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const endpoint = isSignup ? "http://localhost:3001/signup" : "http://localhost:3001/login";
    const payload = isSignup ? { username, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed");

      console.log(isSignup ? "Signup successful" : "Login successful", data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-white font-poppins p-6 relative">
      {/* Back Button */}
      <button
        className="absolute top-5 left-5 px-4 py-2 bg-indigo-600 text-white font-bold rounded shadow-md hover:opacity-90 hover:scale-105 hover:bg-indigo-800 transition-transform"
        onClick={handleBackToLanding}
      >
        Landing Page
      </button>

      {/* Form Container */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-black">
        <h2 className="text-2xl font-semibold text-center mb-2">{isSignup ? "Create an Account" : "Welcome Back!"}</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {isSignup ? "Sign up to get started" : "Enter your details to login"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-black font-semibold mb-1">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-black font-semibold mb-1">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-black font-semibold mb-1">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center mb-3">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-800"} text-white p-3 rounded font-medium transition-transform transform hover:scale-105`}
          >
            {isSubmitting ? "Processing..." : isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <div className="flex items-center my-4 w-full">
          <hr className="flex-grow border-t-2 border-gray-400" />
          <span className="px-2 text-gray-600">Or</span>
          <hr className="flex-grow border-t-2 border-gray-400" />
        </div>

        <p className="text-gray-700 text-center">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            className="ml-1 text-blue-600 font-bold hover:underline"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Login" : "Signup"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;