import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Fade from '@mui/material/Fade';
import checkAuth from "../HOC/checkAuth";

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const result = checkAuth();
    if (result) {
      navigate(`/${result}`);
    }
  }, []);

  const [loginData, setLoginData] = useState<any>({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        loginData
      );
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("userinfo", JSON.stringify(response.data.user));
        navigate(`/${response.data.user.type.toLowerCase()}`);
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <Fade in={true} timeout={3000}>
      <div
        className="flex items-center justify-center h-screen bg-gray-100"
        style={{
          backgroundColor: "#e5e5f7",
          opacity: 1,
          backgroundImage: "radial-gradient(#444cf7 2px, #e5e5f7 2px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-semibold text-center mb-2">
            {" "}
            Login to AnyHealth
          </h1>
          <hr></hr>
          <form className="mt-4" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center p-4">
            <p>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Login;
