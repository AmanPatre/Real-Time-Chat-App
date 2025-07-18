import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import collabIcon from "../assets/people.png";
import sendIcon from "../assets/send.svg";
import profIcon from "../assets/prof.svg";
import Editor from "@monaco-editor/react";

import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { useUser } from "../context/userContext";
import Markdown from "markdown-to-jsx";
import { getWebContainer } from "../config/webContainer";

const Project = () => {
  const location = useLocation();
  const { projectId, userIds = [], projectname } = location.state || {};
  const [users, setUsers] = useState([]);
  const [sidepnl, showsidepnl] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const messageBox = React.createRef();
  const [messages, setMessages] = useState([]);
  const [openFiles, setOpenFiles] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeURL, setIframeURL] = useState(null);
  const [runProcess, setRunProcess] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [iframeExpanded, setIframeExpanded] = useState(false);

  const send = () => {
    if (!user || !user._id) {
      toast.error("User not loaded yet. Please wait...");
      return;
    }

    const msg = {
      message,
      sender: user._id,
    };

    sendMessage("project-message", msg);
    setMessages((prev) => [...prev, msg]);
    setMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("✅ WebContainer started");
      });
    }

    initializeSocket(projectId);

    receiveMessage("project-message", async (data) => {
      let parsedMsg;
      try {
        parsedMsg =
          typeof data.message === "string"
            ? JSON.parse(data.message)
            : data.message;
      } catch (err) {
        parsedMsg = data.message;
      }

      if (typeof parsedMsg === "object" && parsedMsg.fileTree) {
        try {
          await webContainer?.mount(parsedMsg.fileTree);
          console.log("✅ Mounted fileTree:", Object.keys(parsedMsg.fileTree));
          setFileTree(parsedMsg.fileTree);
        } catch (err) {
          console.error("❌ Failed to mount fileTree:", err);
          toast.error("Failed to load files into WebContainer.");
        }
      }

      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    const fetchUsers = async () => {
      try {
        const responses = await Promise.all(
          userIds.map((id) =>
            axios.post(`https://real-time-chat-app-backend-mzzm.onrender.com/user/profile`, { id })
          )
        );
        setUsers(responses.map((res) => res.data.data));
      } catch (error) {
        toast.error("Failed to fetch user details");
      }
    };

    if (userIds.length > 0) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (!webContainer) return;

    const handler = (port, url) => {
      console.log("🚀 Server Ready at:", url);
      setIframeURL(url);
    };

    webContainer.on("server-ready", handler);
    return () => webContainer.off("server-ready", handler);
  }, [webContainer]);

  const writeAImessage = (message) => {
    const messageObject = JSON.parse(message);
    return (
      <div>
        <Markdown>{messageObject.text}</Markdown>
      </div>
    );
  };

  const saveFileTree = async (ft = fileTree) => {
    if (!projectId) {
      toast.error("❌ Project ID is missing.");
      return;
    }

    if (!ft || Object.keys(ft).length === 0) {
      toast.error("⚠️ No file tree to save.");
      return;
    }

    try {
      const res = await axios.post(
        `https://real-time-chat-app-backend-mzzm.onrender.com/project/addFiletree`,
        {
          proj_id: projectId,
          filetree: ft,
        }
      );

      if (res.data.success) {
        toast.success("✅ File tree saved successfully!");
      } else {
        toast.error(res.data.message || "Failed to save file tree");
      }
    } catch (error) {
      toast.error("❌ Error saving file tree");
      console.error("Save file tree error:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="left w-full md:w-1/4 h-[60vh] md:h-screen bg-black relative flex flex-col">
        <div
          className="h-12 md:h-[9vh] bg-[#1e1e1e] relative cursor-pointer flex items-center "
          onClick={() => showsidepnl(!sidepnl)}
        >
          <img
            src={collabIcon}
            className="w-6 h-6 absolute right-6 top-3  md:right-5 md:top-auto"
            alt=""
          />
        </div>

        <div
          ref={messageBox}
          className="messages flex-1 overflow-y-auto relative px-2 py-1"
        >
          {messages.map((msg, index) => {
            const isAI = msg.sender === "ai" || msg.sender?._id === "ai";
            return (
              <div
                key={index}
                className={`
                  ${msg.sender === user._id ? "outgoing" : "incoming"}
                  w-fit max-w-[90vw] md:max-w-[80%] px-2 py-2 rounded-md
                  ${msg.sender === user._id ? "m-2" : "ml-auto m-2"}
                  flex flex-col
                  ${isAI ? "bg-[#282828] text-white" : "bg-white text-black"}
                  text-xs sm:text-sm md:text-base
                `}
              >
                <div className="sender text-xs md:text-sm">
                  <p className="text-gray-600 text-[10px] md:text-[12px]">
                    {users.find(
                      (u) =>
                        u._id &&
                        msg.sender &&
                        u._id.toString() === msg.sender.toString()
                    )?.name || "AI"}
                  </p>
                </div>
                <div className="message break-words">
                  {isAI ? (
                    writeAImessage(msg.message)
                  ) : (
                    <div>{msg.message}</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Collaborator Side Panel */}
          <div
            className={`sidepanel w-[90vw] sm:w-[80vw] md:w-[80%] h-full absolute top-0 left-0 bg-[#1e1e1e] transition-transform duration-300 ease-in-out z-20 ${
              sidepnl ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="collaborators flex flex-col gap-3 p-3 ">
              <div className="w-full rounded text-xs p-2 bg-black text-white text-center">
                Collaborators
              </div>
              {users.map((user) => (
                <div
                  key={user._id}
                  className="w-full bg-white rounded text-xs p-2 flex items-center gap-2"
                >
                  <img src={profIcon} alt="" className="w-6 h-6" />
                  <p>{user.name}</p>
                </div>
              ))}
              <div className="bottom-0 bg-white mb-2 text-[10px] flex text-center justify-center w-full relative">
                Project ID : {projectId}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#00cf98d9] h-12 md:h-[8vh] absolute bottom-0 left-0 right-0 flex items-center px-2 gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-[#1e1e1e] h-10 w-4/5 pl-2.5 border-[#00cf98d9] text-amber-50 rounded text-xs sm:text-sm md:text-base"
            type="text"
            placeholder="Enter Message"
          />
          <button
            onClick={send}
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <img src={sendIcon} alt="" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right w-full md:w-3/4 h-[60vh] md:h-screen bg-[#1e1e1e] flex flex-col md:flex-row">
        {/* File Explorer */}
        <div className="explorer h-32 md:h-full w-full md:w-1/5 bg-[#282828] overflow-x-auto">
          <div className="file_tree flex flex-row md:flex-col text-center gap-1 m-auto pt-1">
            {Object.keys(fileTree).map((file, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles((prev) =>
                    prev.includes(file) ? prev : [...prev, file]
                  );
                }}
                className="tree_element cursor-pointer bg-[#161616] font-bold px-2 py-1 text-[#8b8b8b] gap-1 text-xs sm:text-sm md:text-base"
              >
                <p className="truncate max-w-[100px] md:max-w-none">{file}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor + Run/Save */}
        {currentFile ? (
          <div className="code_editor flex flex-col h-64 md:h-full w-full md:w-4/5">
            <div className="top flex flex-wrap justify-between items-center bg-[#1e1e1e] px-2 py-1 border-b border-gray-700">
              {/* File tabs */}
              <div className="flex overflow-x-auto">
                {openFiles.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFile(item)}
                    className={`px-2 py-1 text-xs sm:text-sm whitespace-nowrap font-medium rounded-t ${
                      currentFile === item
                        ? "bg-[#252526] text-white border-b-2 border-[#1ce3ad]"
                        : "bg-[#1e1e1e] text-gray-400 hover:bg-[#2d2d2d]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={async () => {
                    if (!webContainer)
                      return toast.error("WebContainer not ready");
                    if (!fileTree["package.json"])
                      return toast.error("package.json is missing");

                    try {
                      setIsRunning(true);
                      console.log("🔃 Running build (npm install)...");

                      await webContainer.mount(fileTree);

                      // Install
                      const installProcess = await webContainer.spawn("npm", [
                        "install",
                      ]);
                      installProcess.output.pipeTo(
                        new WritableStream({
                          write(chunk) {
                            console.log("📦 npm install:", chunk);
                          },
                        })
                      );

                      await installProcess.exit;
                      console.log("✅ Packages installed");
                    } catch (error) {
                      console.error("❌ npm install failed", error);
                      toast.error("npm install failed: check console logs");
                    } finally {
                      setIsRunning(false);
                    }

                    try {
                      console.log("🚀 Starting dev server (npm start)...");
                      if (runProcess) await runProcess.kill();

                      const newRunProcess = await webContainer.spawn("npm", [
                        "start",
                      ]);
                      setRunProcess(newRunProcess);

                      newRunProcess.output.pipeTo(
                        new WritableStream({
                          write(chunk) {
                            console.log("🚀 npm start:", chunk);
                          },
                        })
                      );

                      console.log("✅ Dev server started");
                    } catch (error) {
                      console.error("❌ npm start failed", error);
                      toast.error("npm start failed: check console logs");
                    }
                  }}
                  className={`${
                    isRunning
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#1cdfabce] hover:bg-green-700"
                  } text-white px-2 sm:px-4 py-1 rounded shadow flex items-center justify-center text-xs sm:text-sm`}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Run"
                  )}
                </button>

                <button
                  onClick={() => saveFileTree()}
                  className="bg-black hover:bg-gray-800 text-white px-2 sm:px-4 py-1 rounded shadow text-xs sm:text-sm"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="bottom bg-white h-40 md:h-full flex flex-grow w-full">
              {fileTree[currentFile] ? (
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  language={
                    currentFile.endsWith(".js")
                      ? "javascript"
                      : currentFile.endsWith(".json")
                      ? "json"
                      : currentFile.endsWith(".css")
                      ? "css"
                      : "plaintext"
                  }
                  value={fileTree[currentFile].file.contents}
                  onChange={(value) => {
                    setFileTree({
                      ...fileTree,
                      [currentFile]: {
                        ...fileTree[currentFile],
                        file: {
                          ...fileTree[currentFile].file,
                          contents: value,
                        },
                      },
                    });
                  }}
                  theme="vs-dark"
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:block flex-1"></div>
        )}

        {/* Iframe Preview */}
        {iframeURL &&
          webContainer &&
          (iframeExpanded ? (
            // Overlay mode
            <div
              className="fixed top-0 left-0 w-[60vw] h-[90vh] z-50 bg-[#1e1e1e] border-l border-gray-700 transition-all duration-300 flex flex-col"
              style={{
                right: 0,
                margin: "auto",
                borderRadius: "8px",
                boxShadow: "0 0 40px 10px #1ce3ad33",
              }}
            >
              <div className="address-bar w-full bg-[#252526] border-b border-gray-700 p-2 flex items-center gap-2">
                <input
                  onChange={(e) => setIframeURL(e.target.value)}
                  type="text"
                  value={iframeURL}
                  className="bg-[#1e1e1e] text-gray-300 border border-gray-600 rounded px-2 py-1 flex-1 focus:outline-none focus:border-[#1cdfabce] text-xs sm:text-sm"
                  placeholder="Preview URL"
                />
                <button
                  onClick={() => setIframeExpanded(false)}
                  className="bg-[#1ce3ad] text-black px-2 py-1 rounded hover:bg-[#00cf98d9] transition text-xs"
                >
                  Minimize
                </button>
              </div>
              <iframe
                className="w-full h-full bg-white border-none rounded-b shadow-inner"
                src={iframeURL}
                title="Live Preview"
              />
            </div>
          ) : (
            // Normal mode
            <div
              className="flex flex-col h-40 md:h-full border-t md:border-t-0 md:border-l border-gray-700 bg-[#1e1e1e] transition-all duration-300"
              style={{
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <div className="address-bar w-full bg-[#252526] border-b border-gray-700 p-2 flex-col justify-between items-center gap-2">
                <div>
                  <input
                    onChange={(e) => setIframeURL(e.target.value)}
                    type="text"
                    value={iframeURL}
                    className="bg-[#1e1e1e] text-gray-300 border border-gray-600 rounded px-2 py-1 flex-1 focus:outline-none focus:border-[#1cdfabce] text-xs sm:text-sm w-[50%]"
                    placeholder="Preview URL"
                  />
                </div>
                <div>
                  <button
                    onClick={() => setIframeExpanded(true)}
                    className="bg-[#1ce3ad] text-black px-2 py-1 rounded hover:bg-[#00cf98d9] transition text-xs"
                  >
                    Max
                  </button>
                </div>
              </div>
              <iframe
                className="w-full h-full bg-white border-none rounded-b shadow-inner"
                src={iframeURL}
                title="Live Preview"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Project;
