import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  { email: "abhi@123", password: "123" },
  { email: "teacher@example.com", password: "123456" },
  { email: "admin@example.com", password: "123456" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Redirect to common dashboard
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
