import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { Bot } from "lucide-react";

const ChatBot = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (userInput.trim() === "") return;

    const newMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    inputRef.current?.focus();
    setLoading(true);

    try {
      const token = localStorage.getItem("synapto_token");
      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();

      const botReply = {
        sender: "bot",
        text: data.reply || "Sorry, I didn’t get that.",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Error sending message:", err);
      const botReply = {
        sender: "bot",
        text: "Something went wrong. Try again.",
      };
      setMessages((prev) => [...prev, botReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      const token = localStorage.getItem("synapto_token");
      await fetch("http://localhost:5050/api/chat", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages([]);
    } catch (err) {
      console.error("Error clearing chat:", err);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("synapto_token");
        const res = await fetch("http://localhost:5050/api/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const allMessages = data.flatMap((chat) => chat.messages);
        setMessages(allMessages || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen text-white bg-gradient-to-b from-[#04071D] via-[#0d0d2f] to-black font-orbitron">
      <aside className="w-72 bg-[#0f1125] border-r border-cyan-700 p-4 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-72 h-72 mx-auto transition-transform duration-300 hover:scale-105">
              <Spline scene="https://prod.spline.design/IC0J9SyOs87x75Eo/scene.splinecode" />
            </div>
            <h3 className="text-lg font-bold text-cyan-400">SynaptoBot</h3>
            <p className="text-xs text-gray-400 px-2 leading-relaxed">
              Hi! I'm your smart study buddy 🤖 — here to guide, track, and
              assist you!
            </p>
          </div>

          <div className="border-t border-cyan-700 mt-6 pt-4 space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#3b82f6] px-4 py-2 rounded-md text-left text-sm text-white shadow-md hover:shadow-cyan-500/30 transition duration-300"
            >
              🧭 Dashboard
            </button>
            <button
              onClick={() => navigate("/attendance")}
              className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#3b82f6] px-4 py-2 rounded-md text-left text-sm text-white shadow-md hover:shadow-cyan-500/30 transition duration-300"
            >
              📅 Attendance
            </button>

            <button
              onClick={() => navigate("/subject-file-manager")}
              className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#3b82f6] px-4 py-2 rounded-md text-left text-sm text-white shadow-md hover:shadow-cyan-500/30 transition duration-300"
            >
              📓 Notes
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#3b82f6] px-4 py-2 rounded-md text-left text-sm text-white shadow-md hover:shadow-cyan-500/30 transition duration-300"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-600 hover:brightness-110 px-4 py-2 rounded-md text-sm font-semibold shadow-lg"
        >
          Clear Chat
        </button>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-cyan-700 flex items-center gap-3">
          <Bot size={28} className="text-cyan-400" />
          <h1 className="text-xl font-semibold text-white">SynaptoBot</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scroll scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-sm leading-relaxed transition duration-300 whitespace-pre-wrap break-words shadow-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-right shadow-cyan-500/30"
                    : "bg-[#1c1e36] border border-cyan-700 text-left"
                }`}
              >
                <p className="text-sm tracking-wide">{msg.text}</p>
                {msg.time && (
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {new Date(msg.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3 bg-cyan-800/40 rounded-xl italic animate-pulse text-sm">
                Bot is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="flex gap-3 p-4 border-t border-cyan-700 backdrop-blur-md bg-[#0e112b]/80"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            value={userInput}
            ref={inputRef}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-md bg-[#101530] border border-cyan-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 backdrop-blur-sm transition duration-300"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-2 rounded-md font-semibold transition duration-300"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatBot;
