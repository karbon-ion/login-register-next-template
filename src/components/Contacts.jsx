import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contacts = () => {
  const [chatList, setChatList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const initialData = {email: "",}
  const [formData, setFormData] = useState(initialData);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${process.env.BACKEND_API_URL}/api/contacts`, {
        headers: headers,
      });
      setChatList(response.data.contacts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${process.env.BACKEND_API_URL}/api/auth/signup`, {
        headers: headers,
      });
      setUserList(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };

  const chatContact = (id, name)=>{
    localStorage.setItem('chatUserId', id);
    localStorage.setItem('chatUserName', name);
  }
  useEffect(() => {
    if (loading) {
      fetchContacts();
      fetchUsers();
    }
  }, [loading]);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddContact = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${process.env.BACKEND_API_URL}/api/contacts`,
        formData,
        {
          headers: headers,
        }
      );
        setShowModal(false);
        setFormData(initialData);
        setLoading(true);
        toast.success(response.data.message);
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error(response.data.error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold mb-4">Contact List</p>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-2 h-8 rounded"
        >
          +
        </button>
      </div>
      <ul className="mt-4">
        {loading ? (
          <>loading...</>
        ) : (
          <>
            {Array.isArray(chatList) && chatList.length > 0 ? (
              chatList.map((chat) => (
                <li key={chat._id} className="mb-2 flex justify-between">
                  <div>
                    <p className="font-semibold">{chat.name}</p>
                  </div>
                  <button onClick={()=>chatContact(chat.user_id, chat.name)} className="bg-blue-500 text-white px-2 py-1 rounded ml-2"> Chat </button>
                </li>
              ))
            ) : (
              <li>No contacts available</li>
            )}
          </>
        )}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <div className="flex justify-between">

            <h2 className="text-lg font-semibold mb-4">Add Contact</h2>
            <button  onClick={handleModalClose} className="text-lg font-semibold mb-4 pointer">x</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
            <select name="email" value={formData.email} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md">
              <option value="#" >choose</option>
              {
                userList?.map((e)=>{
                  return(
                    <>
                    <option value={e.email}>{e.email}</option>
                    </>
                  )
                })
              }
            </select>
            </div>
           
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
