import React from "react";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [project, addProject] = useState(false);
  const [pname, setpname] = useState("");
  const [pid, setPid] = useState("");
  const [projects, setProjects] = useState([]);
  const [join_prj, set_join_prj] = useState(false);
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/project/createProject`,
        { name: pname },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.data.success) {
        return toast.error(res.data.message.errorResponse.errmsg);
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
    window.location.reload();
  };

  const handleSubmitpid = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8080/project/adduser`,
        { proj_id: pid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.data.success) {
        return toast.error(res.data.message);
      }

      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getProjects = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/project/getproject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.data.success) {
        return axios.post(res.data.message);
      }

      setProjects(res.data.project);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center sm:mb-8 sm:px-4 ">
          <h1 className="text-xs md:text-base px-2 py-1   font-bold text-white tracking-tight">
            Your Projects
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => addProject(true)}
              className=" text-xs md:text-base flex items-center gap-2 cursor-pointer bg-[#1ce3ad] text-black  px-2 py-1  sm:px-5 sm:py-2 rounded-lg shadow transition"
            >
              <span>New Project</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 5v14m7-7H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              onClick={() => set_join_prj(true)}
              className=" text-xs md:text-base flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white sm:px-5  px-2 py-1 sm:py-2 rounded-lg shadow transition"
            >
              <span>Join Project</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="9"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="15"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Glassmorphism Project Area */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-10">
          {/* Create Project Form */}
          {project && (
            <div className="flex justify-center mb-6">
              <form
                onSubmit={handleSubmit}
                className="bg-white/80 rounded-xl shadow p-6 flex flex-col gap-4 w-full max-w-sm"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Add Project Name
                </h2>
                <input
                  type="text"
                  name="name"
                  value={pname}
                  placeholder="Project Name"
                  onChange={(e) => setpname(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-[#1ce3ad] text-white px-4 py-2 rounded  transition"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => addProject(false)}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Join Project Form */}
          {join_prj && (
            <div className="flex justify-center mb-6">
              <form
                onSubmit={handleSubmitpid}
                className="bg-white/80 rounded-xl shadow p-6 flex flex-col gap-4 w-full max-w-sm"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Enter Project ID
                </h2>
                <input
                  type="text"
                  name="pid"
                  value={pid}
                  placeholder="Project ID"
                  onChange={(e) => setPid(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                  >
                    Join
                  </button>
                  <button
                    type="button"
                    onClick={() => set_join_prj(false)}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
            {projects.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  Navigate("/project", {
                    state: {
                      projectId: item._id,
                      userIds: item.users,
                      projectname: item.name,
                    },
                  })
                }
                className="cursor-pointer bg-white/80 hover:bg-blue-50 border border-gray-200 rounded-xl shadow p-6 transition flex flex-col gap-2"
              >
                <div className="font-bold text-lg text-gray-800">
                  {item.name}
                </div>
                <div className="text-gray-500 text-sm">ID: {item._id}</div>
                <div className="text-gray-600 text-sm">
                  Collaborators:{" "}
                  <span className="font-semibold">{item.users.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
