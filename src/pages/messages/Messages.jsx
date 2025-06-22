import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Messages.scss";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUser = {
    id: 1, // Replace with actual logged-in user's ID
    username: "fida",
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          throw new Error("Access token is missing. Please log in.");
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/chat/users/${currentUser.id}/chats/`
        );

        setChats(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching chats.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentUser.id]);

  const handleViewChat = (roomId) => {
    navigate("/message", { state: { roomID: roomId } });
  };

  if (loading) {
    return (
      <div className="messages">
        <div className="container">
          <p className="loading">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages">
        <div className="container">
          <p className="error-message">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="messages">
        <div className="container">
          <p className="no-chats">No chats found for this user.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages">
      <div className="container">
        <div className="title">
          <h1>Messages</h1>
        </div>
        <div className="chat-list">
          {chats.map((chat) => {
            const otherParticipant = chat.member.find(
              (member) => member.id !== currentUser.id
            );

            // Only show chats that have another participant (not just the current user)
            if (!otherParticipant) {
              return null; // Skip this chat
            }

            return (
              <div
                key={chat.roomId}
                className="chat-card"
                onClick={() => handleViewChat(chat.roomId)}
              >
                <div className="participant">
                  {otherParticipant
                    ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                    : "Only You"}
                </div>
                <button className="view-chat-button">View Chat</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Messages;
