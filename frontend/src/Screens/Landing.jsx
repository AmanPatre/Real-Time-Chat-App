import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import logo_trans from "../assets/logoi_trans.png";
import prof from "../assets/prof_rounded.png";

const Landing = () => {
  const [sideScreen, setSideScreen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currState, setCurrState] = useState("Login"); // "Login" or "Sign Up"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [userdata, setuserdata] = useState({});
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const { user } = useUser();

  const { setUser, token, setToken } = useUser();

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currState === "Login") {
        const res = await axios.post(
          `http://localhost:8080/user/login`,
          {
            email: form.email,
            password: form.password,
          }
        );
        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);

        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        console.log(res.data.data);
        setuserdata(res.data.data);

        // Navigate('/home');
      } else {
        // Sign Up
        const res = await axios.post(
          `http://localhost:8080/user/register`,
          form
        );
        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }
        toast.success(res.data.message);
        setCurrState("Login");
      }
      setShowLogin(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const handleGetStarted = () => {
    if (token) {
      Navigate("/home");
    } else {
      setShowLogin(true);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged Out");
    window.location.reload();
  };

  const handleBurger = () => {
    setShowLeftSidebar(!showLeftSidebar);
  };

  return (
    <div className="main_container h-[100vh] w-[100vw] bg-black">
      <div
        className={` w-[50vw] h-[100%] absolute flex flex-col justify-between text-white  p-5  transition-transform duration-300 ease-in-out bg-[#1e1e1e]  ${
          showLeftSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          onClick={() => handleBurger()}
          className="close absolute right-3 top-1"
        >
          X
        </div>
        <div className="nav_elements">
          <ul className="flex flex-col gap-5 mt-10">
            <li>About</li>
            <li>Contact Me</li>
            <li>Tech Used</li>
            <li>Docs/Guide</li>
          </ul>
        </div>
        <div className="logo">
          <img src={logo_trans} alt="" />
        </div>
      </div>
      <div className="navbar h-[8vh] w-full flex justify-between border items-center  px-5">
        <div className="logo flex gap-2 justify-center items-center">
          <svg
            onClick={() => {
              handleBurger();
            }}
            className="cursor-pointer sm:hidden"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            color="#ffffff"
            fill="none"
          >
            <path
              d="M4 5L20 5"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M4 12L20 12"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M4 19L20 19"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <img
            className=" h-[15px] w-[100px] sm:h-[25px] sm:w-[140px]"
            src={logo_trans}
            alt=""
          />
        </div>
        <div className="menu_items text-white">
          {" "}
          <ul className="hidden sm:flex gap-10 cursor-pointer text-xs lg:text-base text-white">
            {["About", "Contact Me", "Tech Used", "Docs/Guide"].map(
              (item, i) => (
                <li key={i} className="relative group overflow-hidden">
                  <span className="text-white">{item}</span>
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#1ce3ad] group-hover:w-full transition-all duration-300"></span>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="login_sec flex gap-5">
          {!token ? (
            <div className="login ">
              <button
                onClick={() => setShowLogin(true)}
                className="text-[#1ce3ad] border border-[1ce3ad] rounded-sm py-0.5 px-1  cursor-pointer"
              >
                Log In
              </button>
            </div>
          ) : (
            <div
              onClick={() => setSideScreen(!sideScreen)}
              className="text-white cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#ffffff"
                fill="none"
              >
                <path
                  d="M17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5C14.7614 13.5 17 11.2614 17 8.5Z"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M19 20.5C19 16.634 15.866 13.5 12 13.5C8.13401 13.5 5 16.634 5 20.5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>{" "}
            </div>
          )}
        </div>
      </div>

      <div className="flex ">
        <div className="main_cont w-[80vw]  mx-auto h-[90vh] flex justify-center items-center ">
          <div className="middle_cont w-[95%] sm:w-[70%]  justify-around items-center flex flex-col">
            <div className="header">
              <h1 className="text-white text-2xl sm:text-4xl lg:text-6xl text-center font-medium">
                Connect & Code with Your AI Teammate
              </h1>
            </div>
            <div className="header_below mt-5">
              <p className="text-[#8f9694] text-center text-base lg:text-xl">
                A real-time chat room to collaborate, share ideas, and generate
                code using @ai — right in your browser.
              </p>
            </div>
            <div className="button">
              <button
                onClick={() => handleGetStarted()}
                className="get_started bg-[#1ce3ad] px-8 py-1 cursor-pointer mt-5 rounded-sm hover:bg-[#00cf98d9]"
              >
                Get Started{" "}
              </button>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col p-5 justify-between items-center text-white side_screen fixed right-0 w-[70vw] sm:w-[40vw] lg:w-[20vw] ] bg-[#1e1e1e] rounded-l-2xl h-[92vh] transition-transform duration-300 ease-in-out ${
            sideScreen ? "-translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="profile_icon">
              <img className="w-[100px]" src={prof} alt="" />
            </div>
            <div className="personal_info text-white text-center">
              {user ? (
                <>
                  <p className="text-[#1ce3ad]">{user.name}</p>
                  <p className="text-[12px]">{user.email}</p>
                </>
              ) : (
                <>
                  <p className="text-[#1ce3ad]">Guest</p>
                  <p className="text-[12px]">No email</p>
                </>
              )}
            </div>
          </div>
          <div className="logout">
            <button
              onClick={() => handleLogout()}
              className="bg-red-600 cursor-pointer px-2 rounded text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Place the popup here, outside main_cont but inside main_container */}
      {showLogin && (
        <div className="LoginPopUp text-white fixed z-50 inset-0 bg-[#00000090] grid">
          <form
            onSubmit={handleSubmit}
            className="place-self-center md:w-[23vw] w-[60vw] flex flex-col gap-[25px] py-[25px] px-[30px] rounded-[8px] text-[14px] bg-[#1e1e1e]"
          >
            <div className="title flex justify-between  text-center">
              <h2 className="text-white">{currState}</h2>
              <span
                onClick={() => setShowLogin(false)}
                className="w-[16px] cursor-pointer text-white"
              >
                ✕
              </span>
            </div>
            <div className="flex flex-col gap-[20px]">
              {currState === "Sign Up" && (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="border border-[#c9c9c9] rounded p-[5px] text-white"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-[#c9c9c9] rounded p-[5px] text-white"
                required
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="border rounded border-[#c9c9c9] p-[5px] text-white"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#1bdfaa] text-black w-full p-[5px] rounded cursor-pointer"
              >
                {currState === "Sign Up" ? "Create Account" : "Login"}
              </button>
            </div>
            <div className="flex justify-between gap-[10px]">
              <input type="checkbox" required />
              <p className="text-[10px] text-white">
                By continuing, I agree to the terms of use & privacy policy
              </p>
            </div>
            {currState === "Login" ? (
              <p className="text-center text-white">
                Create account?{" "}
                <span
                  className="text-[#1bdfaa] cursor-pointer font-semibold"
                  onClick={() => setCurrState("Sign Up")}
                >
                  Click Here
                </span>
              </p>
            ) : (
              <p className="text-center text-white">
                Already have an Account{" "}
                <span
                  className="text-[#1bdfaa] cursor-pointer font-semibold"
                  onClick={() => setCurrState("Login")}
                >
                  Login
                </span>
              </p>
            )}
          </form>
        </div>
      )}

      {/* Glowing background effect */}
      <div
        className="pointer-events-none fixed left-1/2 -translate-x-1/2 -bottom-65 z-0"
        style={{
          width: "300vw",
          height: "50vw",
          maxWidth: 1000,
          maxHeight: 300,
          background:
            "radial-gradient(ellipse at center, #1ce3ad 0%, rgba(28,227,173,0.2) 40%, transparent 100%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
};

export default Landing;
