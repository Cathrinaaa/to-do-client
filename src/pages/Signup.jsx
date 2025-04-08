import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async () => {
    if (!username || !password || !fname || !lname) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/add-user", {
        username,
        password,
        fname,
        lname,
      });

      if (response.data.success) {
        setSuccessMessage("User successfully registered!");
        setError("");
        setTimeout(() => {
          navigate("/"); // Redirect to login page after successful sign-up
        }, 2000);
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Sign-up error:", err);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-4xl text-center font-bold text-purple-800 mb-8">
          Sign Up 🌟
        </h1>

        {error && (
          <div className="bg-pink-100 text-pink-700 p-3 rounded-lg text-center mb-6 animate-fade-in">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-6 animate-fade-in">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/70"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/70"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/70"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSignUp}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center text-purple-800 mt-6">
          Already have an account?{" "}
          <span
            className="font-semibold text-pink-700 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;