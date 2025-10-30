import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import axios from "axios";
import axiosRetry from "axios-retry";
import icon from "./assets/icon.png";
import loading from "./assets/pulse.svg";
import { motion } from "framer-motion";

axiosRetry(axios, { retries: 3 });

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      navigate("/onboard");
      return;
    }
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const hasEmail = parsed && typeof parsed.email === "string" && parsed.email.length > 0;
      const hasPassword = parsed && typeof parsed.password === "string" && parsed.password.length > 0;
      if (!hasEmail || !hasPassword) {
        navigate("/login");
        return;
      }
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleMinimize = () => {
    invoke("window_minimize");
  };

  const handleClose = () => {
    invoke("window_close");
  };

  const [isHovering] = useState(false);
  const [cursorPos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl w-full max-w-md mx-auto h-auto backdrop-blur-sm bg-opacity-80">
      {/* Dynamic RGB Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl p-[1.5px] pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${cursorPos.x}px ${cursorPos.y}px, 
            rgba(87, 84, 255, 0.4) 0%, 
            rgba(0, 89, 255, 0.2) 40%, 
            rgba(76, 0, 255, 0.1) 60%)`,
          opacity: isHovering ? 1 : 0.3,
          transition: "opacity 0.4s ease-out",
        }}
      />

      {/* Header/Drag Region */}
      <motion.div
        className="flex justify-between items-center p-5"
        data-tauri-drag-region
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          className="w-10 h-10 rounded-lg"
          src={icon}
          alt="User Icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        <div className="flex space-x-3">
          <button
            className="text-gray-400 hover:text-gray-200 transition-all p-1 rounded-lg hover:bg-gray-800/50 cursor-pointer"
            onClick={handleMinimize}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path d="M240-120v-80h480v80H240Z" />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-gray-200 transition-all p-1 rounded-lg hover:bg-gray-800/50 cursor-pointer"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-8 pt-2">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            className="text-4xl font-bold text-white mb-6 tracking-tighter"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            PabloMP
          </motion.h2>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.img
              src={loading}
              alt="Loading"
              className="w-8 h-8 animate-spin"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
