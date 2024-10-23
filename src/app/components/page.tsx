import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

interface IMsgDataTypes {
  sender_id: any;
  receiver_id: any;
  message: String;
  createdAt: string;
}

const ChatPage = () => {
  var socket: any;
  socket = io(`${process.env.BACKEND_CHAT_URL}`);

  const handleAddContact = async (formData: IMsgDataTypes) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        `${process.env.BACKEND_API_URL}/api/messages`,
        formData,
        {
          headers: headers,
        }
      );
    } catch (error) {
      console.error("Error Recieving Message:", error);
    }
  };

  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const sender_id = localStorage.getItem("loginId");
  const receiver_id = localStorage.getItem("chatUserId");
  const chatUserName = localStorage.getItem("chatUserName");
  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        message: currentMsg,
        createdAt: new Date(Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        }),
      };
      await socket.emit("send_msg", msgData);
      setChat((pre) => [...pre, msgData]);
      setCurrentMsg("");
    }
  };

  const endOfChatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        `${process.env.BACKEND_API_URL}/api/messages?receiver_id=${receiver_id}`,
        {
          headers: headers,
        }
      );
      // setChat(response.data.messages);
      const formattedChat = response.data.messages.map(
        (msg: IMsgDataTypes) => ({
          ...msg,
          createdAt: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }),
        })
      );

      setChat(formattedChat);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    if (receiver_id) {
      fetchChatList();
    }
  }, [receiver_id]);

  socket.on("receive_msg", (data: IMsgDataTypes) => {
    handleAddContact(data);
    console.log("receive_msg event triggered:", data);
    setChat((pre) => [...pre, data]);
  });
  useEffect(() => {
    socket.emit("new-user-joined", sender_id);
  }, [sender_id]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);

    // Check if the message is from today
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    // Check if the message is from yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    // If the message is older, return the date
    return messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };
  
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="p-5 flex flex-col w-full">
        <div className="fixed top-1 w-4/5">
          <div className="w-4/5 p-2 bg-gray-300">
            <h1>{chatUserName}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chat.map((msg, key) => (
            <div
              key={key}
              className={
                msg.receiver_id === receiver_id
                  ? "flex items-center gap-5 flex-row-reverse mb-5"
                  : "flex items-center gap-5 mb-5"
              }
            >
              <div className="flex">
                <span className="text-red-600 mr-1">
                  {msg.receiver_id === receiver_id ? "You" : chatUserName}:
                </span>
                <h3 >{msg.message}</h3>
                <span className="text-gray-500 text-xs mt-2 ml-1">{formatDate(msg.createdAt)}</span>
              </div>
            </div>
          ))}

          <div ref={endOfChatRef}></div>
        </div>

        <div className="fixed bottom-3 w-4/5">
          <form onSubmit={(e) => sendData(e)} className="flex ">
            <input
              className="w-3/4 p-2 mr-4"
              type="text"
              value={currentMsg}
              placeholder="Type your message.."
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-3 py-2 rounded">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
