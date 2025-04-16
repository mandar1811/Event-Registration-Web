import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")

  const [password,setPassword]=useState("")
  const navigate=useNavigate()
  console.log(username)

  const registerUser = async(e) => {
   
    e.preventDefault();
    try {
      const res= await axios.post("http://localhost:5000/signup",{
        username,
        email,
        password
      })
      console.log(res)
    //   toa(res.data.message)
      navigate("/login")
      
    } catch (error) {
    //   toast.error("Registation failed")
    console.log("failed")
    }

  };
  return (
    <>
      <section className="h-[90vh] flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
        <div className="md:w-1/3 max-w-sm">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Sample"
          />
        </div>
        <form className="md:w-1/3 max-w-sm" onSubmit={registerUser}>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
            type="text"
            placeholder="Username"
            value={username} onChange={(e)=> setUsername(e.target.value)}
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="email"
            placeholder="Email Address"
            value={email}  onChange={(e) =>setEmail(e.target.value)}
          />

          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            placeholder="Password"
            value={password}  onChange={(e) =>setPassword(e.target.value)}

          /> <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="submit"
            >
              Register User
            </button>
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Already have an account?
            <Link
              className="text-red-600 hover:underline hover:underline-offset-4"
              to="/login"
            >
               Login
            </Link>
          </div>
        </form>
      </section>
    </>
  );
};

export default Register;