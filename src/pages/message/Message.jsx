import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Message.scss";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ReactDOM from "react-dom";

const Message = () => {
  const location = useLocation();
  const { roomID } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [userId, setUserId] = useState("");
  const [textareaError, setTextareaError] = useState(false); // For textarea validation
  const ws = useRef(null);

  // Fetch messages
  useEffect(() => {
    if (!roomID) {
      console.error("Room ID is required to fetch messages.");
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access");
        if (!token) {
          throw new Error("Access token is missing. Please log in.");
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/chat/chats/${roomID}/messages/`,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        setMessages(response.data); // Assume response is an array of messages
      } catch (err) {
        setError(err.message || "An error occurred while fetching messages.");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomID]);

  console.log("roomid", roomID);

  // Fetch current user
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/users/me/",
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
        setUserId(response.data.id);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  // WebSocket connection
  useEffect(() => {
    if (!userId) return;

    ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/users/${userId}/chat/`);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data);

      // Append the new message to the messages state
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  // Send a message
  const sendMessage = () => {
    if (!messageText.trim()) {
      console.log('not working....')
      setTextareaError(true);
      return;
    }

    const messageData = {
      action: "message",
      roomId: roomID,
      user: userId,
      message: messageText,
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(messageData));
      console.log("Message sent:", messageData);
      setMessageText(""); // Clear the input
      setTextareaError(false);
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const closePopup = () => {
    setTextareaError(false);
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link
            to="/messages"
            className="breadcrumbs-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Messages</span>
          </Link>
        </span>
        <hr />
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-item ${msg.user === currentUser?.id ? "owner" : ""}`}
            >
              <img
                src={msg.userImage ? msg.userImage : "https://via.placeholder.com/150"}
                alt={`${msg.userName}'s avatar`}
                className="avatar"
              />
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <hr />
        <div className="write">
          <textarea
            placeholder="Write a message..."
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              setTextareaError(false); // Reset error when user starts typing
            }}
            className="message-textarea"
          />
          {textareaError &&
            ReactDOM.createPortal(
              <div className="popup">
                <div className="popup-content">
                  <p>Message cannot be empty.</p>
                   <button
                   className="popup-close"
                    onClick={closePopup}
                    style={{
                      backgroundColor: '#932dbb',
                      marginTop: '10px',
                      padding: '10px',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '20px',
                      cursor: 'pointer',
                      justifyContent: 'center',
                      borderRadius: '8px'
                    }}
                  >
                    Close
                  </button>


                </div>
              </div>,
              document.body
            )}

          <style>
            {`
              .popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999; /* Ensure it's above all other elements */
              }
              .popup-content {
                background: white;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
                z-index: 10000;
              }
            `}
          </style>


          <button onClick={sendMessage} className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
