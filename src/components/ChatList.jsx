import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatList = () => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${process.env.BACKEND_API_URL}/api/contacts/messages`, {
        headers: headers,
      });
      setChatList(response.data.contacts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (loading) {
      fetchChatList();
    }
  }, [loading]);
  const chatContact = (id, name)=>{
    localStorage.setItem('chatUserId', id);
    localStorage.setItem('chatUserName', name);
  }
  return (
    <div className="p-4">
    <div className="flex justify-between items-center">
      <p className="text-xl font-bold mb-4">Chat List</p>
      
    </div>
    <ul className="mt-4">
      {loading ? (
        <>loading...</>
      ) : (
        <>
          {Array.isArray(chatList) && chatList.length > 0 ? (
            chatList.map((chat) => (
              <li onClick={()=>chatContact(chat.user_id, chat.name)} key={chat._id} className="hover:bg-gray-300 p-4 mb-2 flex justify-between">
                <div>
                  <p className="font-semibold">{chat.name}</p>
                </div>
              </li>
            ))
          ) : (
            <li>No Chat available</li>
          )}
        </>
      )}
    </ul>

    
  </div>
  )
} 

export default ChatList
