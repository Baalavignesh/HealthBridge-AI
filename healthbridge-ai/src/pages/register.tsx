import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Fade } from "@mui/material";
import checkAuth from "../HOC/checkAuth";
import speciality from "../constants/speciality";
import hospital from "../constants/hospital";

const Register: React.FC = () => {
  const [userType, setUserType] = useState<string>("Doctor");

  const [userInfo, setUserInfo] = useState<any>({
    fullName: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    email: "",
    password: "",
    user_type: "Doctor",
    hospital: "",
    hospitalLocation: "",
    specialization: "Surgery",
  });

  useEffect(() => {
    const result = checkAuth();
    if (result) {
      navigate(`/${result}`);
    }
    setUserInfo((prev: any) => ({
      ...prev,
      user_type: userType
    }));
  }, [userType]);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    
    if (e.target.name === "hospital") {
      const selectedHospital = e.target.value;
      const location = hospital[selectedHospital as keyof typeof hospital] || "";
      setUserInfo((prev: any) => ({
        ...prev,
        hospitalLocation: location
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/register", 
        {
          ...userInfo,
          age: Number(userInfo.age)
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      navigate(`/${userType.toLowerCase()}`);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Fade in={true} timeout={1000}> 
    <div className="flex items-center justify-center h-screen bg-gray-100"  style={{
        backgroundColor: "#e5e5f7",
        opacity: 1,
        backgroundImage: "radial-gradient(#444cf7 2px, #e5e5f7 2px)",
        backgroundSize: "40px 40px", 
    }}>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mb-4 flex items-center flex-row justify-between gap-2">
              <label className="block text-gray-700">User Type </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="doctor"
                  name="userType"
                  value="Doctor"
                  checked={userType === "Doctor"}
                  onChange={() => setUserType("Doctor")}
                  className="mr-2"
                />
                <label htmlFor="doctor" className="mr-4">
                  Doctor
                </label>
                <input
                  type="radio"
                  id="patient"
                  name="userType"
                  value="Patient"
                  checked={userType === "Patient"}
                  onChange={() => setUserType("Patient")}
                  className="mr-2"
                />
                <label htmlFor="patient">Patient</label>
              </div>
            </div>
            <hr></hr>
            <label className="block text-gray-700 mt-4" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your full name"
              name="fullName"
              value={userInfo.fullName}
              onChange={handleChange}
              required
            />
          </div>
          {
            userType === "Patient" && (
              <div className="mb-4">
              <label className="block text-gray-700" htmlFor="age">
                Age
              </label>
              <input
                type="number"
                id="age"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your age"
                name="age"
                value={userInfo.age}
                onChange={handleChange}
                required
              />
            </div>
          )}
         
         {
          userType === "Patient" && (
            <div className="mb-4">
            <label className="block text-gray-700" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
              name="gender"
              value={userInfo.gender}
              onChange={handleChange}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          )}

          {
            userType === "Doctor" && (
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="specialization">
                  Specialization
                </label>
                <select
                  id="specialization"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                  name="specialization"
                  value={userInfo.specialization}
                  onChange={handleChange}
                >
                  {speciality.map((speciality: string) => (
                    <option value={speciality}>{speciality}</option>
                  ))}
                </select>
              </div>
            )
          }
          {
            userType === "Doctor" && ( 
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="hospital">
                  Hospital
                </label>
                <select
                  id="hospital"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                  name="hospital"
                  value={userInfo.hospital}
                  onChange={handleChange}
                >
                  {Object.keys(hospital).map((hospitalName: string) => (
                    <option key={hospitalName} value={hospitalName}>
                      {hospitalName}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          {
            userType === "Doctor" && (
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="hospitalLocation">
                  Hospital Location
                </label>
                <input
                  type="text"
                  id="hospitalLocation"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  placeholder="Hospital location"
                  required
                  name="hospitalLocation"
                  value={userInfo.hospitalLocation}
                  disabled
                />
              </div>
            )
          }
          
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="mobile">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your mobile number"
              required
              name="mobile"
              value={userInfo.mobile}
              onChange={handleChange}
            />
          </div>
          {
            userType === "Patient" && (
              <div className="mb-4">
            <label className="block text-gray-700" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your address"
              required
              name="address"
              value={userInfo.address}
              onChange={handleChange}
            />
          </div>
            )
          }
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              required
              name="email"
              value={userInfo.email}
              onChange={handleChange}
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
              required
              name="password"
              value={userInfo.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
            </div>
    </Fade>
  );
};

export default Register;
