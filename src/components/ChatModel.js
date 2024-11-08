import React, { useEffect, useState, useRef } from "react";
import { Avatar } from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import Button from "./Helpers/Button";
import { COLORS } from "./Constants/Constants";
import { io } from "socket.io-client";
import moment from "moment";

export default function ChatModal({
  receiverDetails,
  senderId,
  isOpen,
  setIsOpen,
  isAgent,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isOpen && receiverDetails) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
        query: { userId: senderId },
      });

      socketRef.current.emit("joinRoom", {
        customerId: isAgent ? receiverDetails._id : senderId,
        agentId: isAgent ? senderId : receiverDetails._id,
      });

      socketRef.current.on("chatHistory", (chatHistory) => {
        setMessages(chatHistory);
        scrollToBottom();
      });

      socketRef.current.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });

      socketRef.current.on("updateUserStatus", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketRef.current.off("chatHistory");
        socketRef.current.off("receiveMessage");
        socketRef.current.off("updateUserStatus");
      };
    }
  }, [isOpen, receiverDetails, senderId, isAgent]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        customerId: isAgent ? receiverDetails._id : senderId,
        agentId: isAgent ? senderId : receiverDetails._id,
        senderId,
        message: newMessage,
      };
      socketRef.current.emit("sendMessage", messageData);
      setNewMessage("");
      scrollToBottom();
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((message) => {
      const date = moment(message.timestamp).format("YYYY-MM-DD");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const renderDateHeader = (date) => {
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

    if (date === today) {
      return "Today";
    } else if (date === yesterday) {
      return "Yesterday";
    } else {
      return moment(date).format("MMMM D, YYYY");
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  const getLastSeen = (lastSeen) => {
    const inputDate = moment(lastSeen);

    if (inputDate.isSame(moment(), "day")) {
      return inputDate.format("hh:mm A");
    } else {
      return inputDate.format("MMM D, YYYY hh:mm A");
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-6 w-full max-w-lg bg-white shadow-lg rounded-lg z-10">
      <div className="flex justify-between items-center p-4 bg-orange-100 rounded-t-lg">
        <div className="flex items-center justify-center">
          <Avatar
            src={receiverDetails.photo || "NO IMAGE"}
            alt={receiverDetails.firstName}
          />
          <div className="ml-3">
            <h2
              className="font-bold text-lg"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {receiverDetails.firstName} {receiverDetails.lastName}
            </h2>
            <p className="text-sm text-gray-600">
              {onlineUsers[receiverDetails._id]?.isOnline ? (
                <span className="text-green-500">online</span>
              ) : onlineUsers[receiverDetails._id]?.lastSeen ? (
                <span className="text-gray-500">
                  last seen{" "}
                  {getLastSeen(onlineUsers[receiverDetails._id]?.lastSeen)}
                </span>
              ) : (
                "---"
              )}
            </p>
          </div>
        </div>
        <Close
          onClick={() => {
            socketRef.current.emit("disconnectUser");
            setIsOpen(false);
          }}
          className="cursor-pointer"
        />
      </div>

      <div className="p-4 overflow-y-auto" style={{ height: "450px" }}>
        {Object.keys(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <React.Fragment key={date}>
              <div className="text-center my-2">
                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-full">
                  {renderDateHeader(date)}
                </span>
              </div>
              {msgs.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${
                    message.senderId === senderId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-xs ${
                      message.senderId === senderId
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <p
                      className="font-poppins mb-1"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {message.message}
                    </p>
                    <div className="text-xs text-gray-500 text-right">
                      {moment(message.timestamp).format("h:mm A")}
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
        <div ref={messageEndRef}></div>
      </div>

      <div className="flex p-2 pt-4 border-t border-gray-200 justify-center">
        <div className="flex-1 mx-2">
          <textarea
            ref={textareaRef}
            className="w-full border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 p-2 rounded"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              autoResizeTextarea();
            }}
            onKeyDown={handleKeyPress}
            rows={1}
            style={{
              resize: "none",
              maxHeight: "150px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          />
        </div>
        <div className="flex items-center mb-2">
          <Button
            icon={Send}
            bgColor={COLORS.GREEN_600}
            buttonStyles="w-4 h-4"
            customStyles="mr-2"
            onClick={handleSendMessage}
            isDisabled={newMessage.trim().length === 0}
          />
        </div>
      </div>
    </div>
  );
}
