import axios from "axios";
import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navRef = useRef();
  let access_token=localStorage.getItem("access_token");
// console.log(access_token)
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/logout",
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );
      console.log(res);
      localStorage.removeItem("access_token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };
  

  return (
    <div className="w-full h-16 shadow-md sticky top-0 left-0 right-0 z-50 bg-white ">
      <header className="flex items-center justify-between h-full w-[90%] sm:w-[80%] text-black mx-auto">
        <Link className="text-2xl sm:text-3xl font-bold" to="/">
          Event Ease
        </Link>
        <nav ref={navRef} className="flex items-center z-50">
          <Link
            className="mx-4 text-black hover:text-gray-600  font-semibold text-lg"
            to="/"
          >
            My Registrations
          </Link>
         
          
          {
          !access_token ?  <Link className="mt-5 md:mt-0 mx-4 text-white rounded-md hover:bg-blue-700 text-base font-semibold  bg-blue-600 py-1.5 px-4 " to="/register">
            Register
          </Link>:<button onClick={logout} className="mt-5 md:mt-0 mx-4 text-white rounded-md hover:bg-blue-700 text-base font-semibold  bg-blue-600 py-1.5 px-4 ">Logout</button>
        }

          <button
            className="nav-btn nav-close-btn md:hidden"
            onClick={showNavbar}
          >
            <FaTimes />
          </button>
        </nav>
        <button className="nav-btn md:hidden" onClick={showNavbar}>
          <FaBars />
        </button>
      </header>
    </div>
  );
}

export default Navbar;
