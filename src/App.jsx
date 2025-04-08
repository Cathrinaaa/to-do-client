import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_ENDPOINT_URL;

  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState("");

  // Sign Up states
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");

  // Login function
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setShowError("Username and password are required");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/check-user`, {
        username,
        password,
      });
      if (response.data.exist) {
        localStorage.setItem("username", username); // Store username in localStorage
        navigate("/todo");
      } else {
        setShowError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setShowError("Something went wrong. Please try again.");
    }
  };

  // Sign Up function
  const handleSignUp = async () => {
    if (!username.trim() || !password.trim() || !fname.trim() || !lname.trim()) {
      setSignUpError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/add-user`, {
        username,
        password,
        fname,
        lname,
      });

      if (response.data.success) {
        setSignUpSuccess("User successfully registered!");
        setSignUpError("");
        setTimeout(() => {
          setIsSignUp(false); // Switch back to Login after successful sign-up
        }, 2000);
      } else {
        setSignUpError(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setSignUpError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
        <h1 className="text-4xl text-center font-bold text-purple-800 mb-6">
          {isSignUp ? "Sign Up" : "Login"}
        </h1>

        {/* Error Messages */}
        {showError && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center mb-4">
            {showError}
          </div>
        )}
        {signUpError && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center mb-4">
            {signUpError}
          </div>
        )}
        {signUpSuccess && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4">
            {signUpSuccess}
          </div>
        )}

        {/* Login Form */}
        {!isSignUp && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105"
            >
              Login
            </button>
          </div>
        )}

        {/* Sign Up Form */}
        {isSignUp && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleSignUp}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Toggle between Login and Sign Up */}
        <p className="text-center text-purple-800 mt-4">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span
            className="font-semibold cursor-pointer hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;