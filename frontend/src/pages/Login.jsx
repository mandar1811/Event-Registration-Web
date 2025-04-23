import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
//   const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res= await axios.post("http://localhost:5000/login",{
        
        username,
        password
      })
      console.log(res)
      let access_token=res.data.access_token;
      let is_admin=res.data.is_admin;
      localStorage.setItem("access_token",access_token);
      localStorage.setItem("is_admin",is_admin)
      localStorage.setItem("username",username)
    //   toa(res.data.message)
    if(res.data.is_admin==1){
      navigate("/dashboard")
    }else{

      navigate("/")
    }
      
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
        <form className="md:w-1/3 max-w-sm" onSubmit={loginUser}>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
          >
            Log in
          </button>

          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Don't have an account?
            <Link
              className="text-red-600 hover:underline hover:underline-offset-4"
              to="/register"
            >
              Register
            </Link>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;