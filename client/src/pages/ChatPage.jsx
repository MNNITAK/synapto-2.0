import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const token = JSON.parse(localStorage.getItem("synapto"))?.token;

  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredUser, setHoveredUser] = useState(null);

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef();

  const socketRef = useRef();
  const selectedUserRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Socket setup and user fetch
  useEffect(() => {
    const socket = io("http://localhost:5050");
    socketRef.current = socket;

    socket.on("connect", async () => {
      try {
        const meRes = await axios.get("http://localhost:5050/api/chat/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(meRes.data);
        socket.emit("join", meRes.data._id);

        const usersRes = await axios.get("http://localhost:5050/api/chat/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);

        socket.on("update-user-status", (onlineUserIds) => {          // update the online-users map
            setOnlineUsers(onlineUserIds);
          });
          socket.on("typing", ({ senderId }) => {
            setTypingUser(senderId);
            setIsTyping(true);
          });
          
          socket.on("stop-typing", ({ senderId }) => {
            setTypingUser(null);
            setIsTyping(false);
          });          
      } catch (err) {
        toast.error("Failed to load chat data");
      }
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      const endpoint = selectedUser._id === 'community'
        ? 'messages/community'
        : `messages/${selectedUser._id}`;
    
      axios.get(`http://localhost:5050/api/chat/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setMessages(res.data)).catch(console.error);
    }
  }, [selectedUser]);

  // On the receiver side, when the chat is open, emit "message-read"
  // Finds all messages sent to you that are not read and emits them as message-read
  useEffect(() => {
    if (selectedUser && currentUser && messages.length > 0) {
      const unread = messages
        .filter(m => m.receiver === currentUser._id && m.status !== 'read')
        .map(m => m._id);
  
      if (unread.length > 0) {
        socketRef.current.emit("message-read", {
          messageIds: unread,
          senderId: selectedUser._id
        });
      }
    }
  }, [messages, selectedUser]);

  // Socket listeners
  useEffect(() => {
    const handleMessage = (data) => {
      const currentSelectedUser = selectedUserRef.current;
      const senderId = data.sender?._id || data.sender;
      const receiverId = data.receiver?._id || data.receiver;
  
      // Always emit delivered if current user is ready
      if (currentUser) {
        socketRef.current.emit("message-delivered", {
          messageId: data._id,
          receiverId: currentUser._id,
          senderId
        });
      }
      // show unread msgs count
      if (
        currentUser &&
        data.receiver === currentUser._id &&
        (!selectedUserRef.current || selectedUserRef.current._id !== senderId)
      ) {
        setUnreadCounts(prev => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
      }
      // Only show message in UI if it belongs to current open chat
      if (
        currentSelectedUser &&
        (senderId === currentSelectedUser._id || receiverId === currentSelectedUser._id)
      ) {
        setMessages(prev => [...prev, data]);
      }
    };
    const handleStatusUpdate = ({ messageId, messageIds, status }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            const id = msg._id?.toString();
            if ((messageId && id === messageId) || (messageIds && messageIds.includes(id))) {
              return { ...msg, status };
            }
            return msg;
          })
        );
      };
    if (socketRef.current) {
      socketRef.current.on("receive-message", handleMessage);
      socketRef.current.on("message-status-updated", handleStatusUpdate);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive-message", handleMessage);
        socketRef.current.off("message-status-updated", handleStatusUpdate);
      }
    };
  }, [currentUser]);

  // on clicking a user set unread count to 0
  useEffect(() => {
    if (selectedUser) {
      setUnreadCounts(prev => ({
        ...prev,
        [selectedUser._id]: 0
      }));
    }
  }, [selectedUser]);  
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    socketRef.current.emit("typing", { receiverId: selectedUser._id });
    console.log("Typing emitted to:", selectedUser._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop-typing", { receiverId: selectedUser._id });
    }, 2500);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    try {
      const isCommunity = selectedUser?._id === 'community';
      const res = await axios.post("http://localhost:5050/api/chat/message", {
      receiverId: isCommunity ? null : selectedUser._id,
      text: newMessage.trim(),
      isCommunity,
      }, {
      headers: { Authorization: `Bearer ${token}` }
    });

      const msgToSend = {
        ...res.data,
        sender: currentUser._id,
        receiver: selectedUser._id,
        status: 'sent',
        _id: res.data._id, 

      };
      console.log("Sending message:", JSON.stringify(newMessage));


      setMessages(prev => [...prev, msgToSend]);

      socketRef.current.emit("send-message", {
        receiverId: isCommunity ? null : selectedUser._id,
        message: msgToSend,
        isCommunity,
      });
      setShowEmojiPicker(false);
      socketRef.current.emit("stop-typing", { receiverId: selectedUser._id });
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // to close emoji-picker pop-up on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // image upload setup
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // for preview
    }
  };

  const sendImageMessage = async () => {
    if (!imageFile || !selectedUser || !currentUser) return;
    setIsUploadingImage(true);         // start loading while image upload
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const res = await axios.post('http://localhost:5050/api/chat/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      const imageUrl = res.data.url;
      // Now send this URL as a message
      const isCommunity = selectedUser._id === 'community';
      const msgRes = await axios.post('http://localhost:5050/api/chat/message', {
        receiverId: isCommunity ? null : selectedUser._id,
        text: imageUrl,
        isImage: true,
        isCommunity,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const msgToSend = {
        ...msgRes.data,
        sender: currentUser._id,
        receiver: isCommunity ? null : selectedUser._id,
        status: 'sent',
      };
      setMessages(prev => [...prev, msgToSend]);
      socketRef.current.emit("send-message", {
        receiverId: selectedUser._id,
        message: msgToSend
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to upload image", err);
      toast.error("Image upload failed");
    }finally {
        setIsUploadingImage(false); // Stop loading
      }
  };   

  

  return (
    <div className="flex h-screen font-sans bg-[#0d1117] text-white">
      {/* Sidebar */}
      <div className="w-96 p-6 border-r border-gray-800 bg-[#161b22]">
        <h2 className="text-2xl font-bold mb-6 text-[#ffa058]">Synapto Connect</h2>

        {/* Current User Info */}
        {currentUser && (
            <div className="flex items-center justify-between gap-4 mb-6 p-3 rounded-xl border border-[#30363d] bg-[#21262d] shadow-md">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full border border-gray-700 object-cover"
              />
              <div>
                <h4 className="font-semibold text-white text-lg">{currentUser.name}</h4>
                <p className="text-sm text-gray-400">You</p>
              </div>
            </div>
            {/* Right: Settings Icon */}
            <button
                title="Settings"
                onClick={() => navigate("/settings")}
                className="text-gray-400 hover:text-[#58a6ff] transition text-xl"
            >
                ⚙️
            </button>
          </div>
        )}

        {/* Sidebar */}
        <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full bg-[#0d1117] text-white placeholder-gray-400 border border-[#30363d] focus:ring-2 focus:ring-[#58a6ff] outline-none"
        />

        {/* Community button */}
        <ul className="space-y-2 overflow-y-auto max-h-[85vh] custom-scrollbar">
        <li
          onClick={() => setSelectedUser({ _id: 'community', name: 'Community Chat' })}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold cursor-pointer transform transition-all duration-300
            ${
              selectedUser?._id === 'community'
                ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white shadow-md hover:scale-105'
              }`}
        >
        <span className="text-2xl">🌐</span>
        <span>Community Chat</span>
        </li>
        {users.length === 0 ? (
          <div className="text-gray-400 px-4">No users found</div>
        ) : (
        users
            .filter(user => user?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(user => {
            const isOnline = onlineUsers.includes(user._id);
            const unreadCount = unreadCounts[user._id] || 0;           // to have a count of unread msgs
            return (
                <li
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`px-4 py-2 rounded-xl cursor-pointer transition duration-200 ${
                  selectedUser?._id === user._id
                    ? 'bg-[#205497] text-white'
                    : 'hover:bg-[#21262d] hover:text-[#58a6ff] text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </li>
              
            );
        })
      )}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {selectedUser && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#161b22]">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfile(true)}>
            <img
                src={
                  selectedUser._id === 'community'
                  ? "https://cdn-icons-png.flaticon.com/512/921/921347.png" // a globe icon or your custom community image
                  : selectedUser.profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
                className="w-10 h-10 rounded-full object-cover"
                alt="avatar"
            />
            <div>
            <h3 className="text-lg font-semibold text-white">
              {selectedUser._id === 'community' ? "Community Chat" : selectedUser.name}
            </h3>
            <p className="text-sm text-gray-400">
              {selectedUser._id === 'community'
                ? "Public group for all users"
                : selectedUser.bio || "No bio"}
            </p>
            </div>
        </div>

            {isTyping && typingUser?.toString() === selectedUser._id?.toString() && (
                <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-[#58a6ff] animate-pulse">Typing</span>
                <div className="flex space-x-1">
                <span className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                <span className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                <span className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                </div>
            </div>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 px-6 pt-4 pb-2 custom-scrollbar">
          {selectedUser ? (
            <>
              {messages.map((msg, index) => {
                const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                const senderObj = typeof msg.sender === "object"
                  ? msg.sender
                  : senderId === currentUser?._id
                  ? currentUser
                  : users.find(u => u._id === senderId);
                  const isSender = senderId === currentUser?._id;
                const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                    <div key={index} className={`w-full flex ${isSender ? 'justify-end' : 'justify-start'} items-start`}>
                    {!isSender && (
                      <img
                        src={senderObj?.profileImage  || "https://www.w3schools.com/howto/img_avatar.png"}
                        alt="sender"
                        className="w-6 h-6 rounded-full object-cover mr-2 mt-1 cursor-pointer border border-gray-500"
                        onClick={() => setHoveredUser(senderObj)} // <-- open profile modal
                      />
                    )}
                    
                    <div className="flex flex-col items-end max-w-[70%]">
                      <div
                        className={`inline-block max-w-[70%] px-4 py-3 rounded-xl text-sm shadow-md break-words ${
                          isSender
                            ? 'bg-[#238636] text-white'
                            : 'bg-[#21262d] text-white border border-[#30363d]'
                        }`}
                      >
                        {msg.isImage ? (
                          // wrapping in anchor tag we can click the image and view it full-size
                          <a href={msg.text} target="_blank" rel="noopener noreferrer">
                            <img
                              src={msg.text}
                              alt="sent"
                              className="max-w-full max-h-64 rounded-xl object-contain border border-gray-600"
                              style={{ display: 'block' }}
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </a>
                        ) : (
                            <p className="whitespace-pre-line break-words">{msg.text}</p>
                        )}
                      </div>
                  
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <span>{time}</span>
                        {isSender && (
                          <span className="italic">
                            {msg.status === 'read' ? '✓✓ Read' : msg.status === 'delivered' ? '✓✓ Delivered' : '✓ Sent'}
                          </span>
                        )}
                      </div>
                    </div>
                    </div>
                );
            })}
             {/* to show typing indication */}
            {isTyping && typingUser === selectedUser?._id && (
                <div className="flex items-center space-x-2 px-4">
                    <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center">
                        <span className="text-white text-lg">💬</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-[#21262d] text-sm text-gray-300 animate-pulse">
                        {selectedUser.name} is typing...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
           </>
          ) : (
            <div className="text-center mt-32 text-gray-400 text-lg">
              Select a user to start chatting
            </div>
          )}
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="px-6 py-4 border-t border-gray-800 flex items-center space-x-4 bg-[#0d1117]">
            {/* Emoji Button */}
            <button
                onClick={() => setShowEmojiPicker(prev => !prev)}        // onClick: Toggles the visibility of the emoji picker using state showEmojiPicker
                className="text-white text-2xl"
            >
                😊
            </button>
            {/* Emoji Picker Popup */} 
            {showEmojiPicker && (         // Renders the picker only when showEmojiPicker is true
                <div ref={emojiPickerRef} className="absolute bottom-20 left-6 z-50">
                <EmojiPicker          // Component from the emoji-picker-react library
                onEmojiClick={(emojiData) => {
                setNewMessage(prev => prev + emojiData.emoji);
            }}
            theme="dark"
            />
          </div>
        )}

            {/* Input */}
            <input
              type="text"
              value={newMessage}
              onChange={e => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-full bg-[#0d1117] text-white placeholder-gray-500 border border-[#30363d] focus:ring-2 focus:ring-[#58a6ff] outline-none"
            />

            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="imageUpload" />
            <label htmlFor="imageUpload" className="cursor-pointer text-2xl">📷</label>



            {imagePreview && (
                <>
                <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-32 h-32 object-cover rounded-xl mt-2" />
                <button onClick={() => setImagePreview(null)} className="absolute top-1 right-1 bg-red-500 text-white text-sm px-2 py-1 rounded-full">✕</button>
                <button onClick={sendImageMessage} className="bg-[#238636] text-white px-4 py-2 rounded-full mt-2" disabled={isUploadingImage}>
                    {isUploadingImage ? "Sending..." : "Send Image"}
                </button>
                </div>
                {isUploadingImage && (
                    <div className="text-sm text-gray-400 mt-2 animate-pulse">Uploading image...</div>
                  )}
                </> 
            )}
            <button
              onClick={sendMessage}
              className="bg-[#238636] hover:bg-[#2ea043] transition px-6 py-3 rounded-full font-semibold text-white shadow-md"
            >
              Send
            </button>
          </div>
        )}
      </div>
      {showProfile && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#161b22] p-6 rounded-xl shadow-lg w-96 text-white relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-2 right-3 text-white text-xl"
            >
              ✕
            </button>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={
                  selectedUser._id === 'community'
                    ? "https://cdn-icons-png.flaticon.com/512/921/921347.png" // a globe icon or your custom community image
                    : selectedUser.profileImage || "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-600"
              />
              <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
              {selectedUser._id === 'community' ? (
              <>
                <p className="text-gray-400 text-center">A public space to share ideas with everyone 🌐</p>
                <p className="text-sm text-gray-500">Email: community@quantumconnect.io</p>
                <p className="text-sm text-gray-500">You Joined: {new Date(currentUser?.createdAt).toLocaleDateString()}</p>
              </>
              ) : (
              <>
                <p className="text-gray-400 text-center">{selectedUser.bio || "No bio available."}</p>
                <p className="text-sm text-gray-500">Email: {selectedUser.email || "N/A"}</p>
                <p className="text-sm text-gray-500">Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </>
            )}
           </div>
          </div>
        </div>
      )}

      {/* to show user info who sent the msg */}
      {hoveredUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#161b22] p-6 rounded-xl shadow-lg w-96 text-white relative">
            <button
            onClick={() => setHoveredUser(null)}
            className="absolute top-2 right-3 text-white text-xl"
          >
            ✕
          </button>
          <div className="flex flex-col items-center space-y-4">
            <img
              src={hoveredUser.profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-600"
            />
            <h2 className="text-xl font-semibold">{hoveredUser.name}</h2>
            <p className="text-gray-400 text-center">{hoveredUser.bio || "No bio available."}</p>
            <p className="text-sm text-gray-500">Email: {hoveredUser.email || "N/A"}</p>
            <p className="text-sm text-gray-500">Joined: {new Date(hoveredUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}