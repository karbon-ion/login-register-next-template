import Head from 'next/head';
import { Fragment, useState } from 'react';
import { useRouter} from 'next/navigation';
import Contacts from "./Contacts";
import ChatList from "./ChatList";
import Groups from "./Groups";
import axios from 'axios';
import ChatPage from '@/app/components/page';


const DummyChat = () => {
  const chat = [
    { id: 1, sender: 'You', message: 'Hello, how are you?' },
    { id: 2, sender: 'Hammad', message: 'I am good, thanks!' }
  ];

  return (
    
    <div>
      <ul>
        {chat.map((message) => (
          <li key={message.id} className="mb-2">
            <div
              className={`${
                message.sender === 'You' ? 'text-right' : 'text-left'
              }`}
            >
              <p className="font-semibold">{message.sender} : {message.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Dashboard = () => {
  const loginName = localStorage.getItem("loginName");
    const router = useRouter()
    const [activeSection, setActiveSection] = useState('chat');
    const handleLogout = async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.get(`${process.env.BACKEND_API_URL}/api/auth/logout`, { headers });
          if (response.status === 200) {
            localStorage.removeItem('token'); 
            sessionStorage.removeItem('token'); 
            router.push('/'); 
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
    };
    const handleSectionChange = (section) => {
      setActiveSection(section);
    };
      
  return (
    <Fragment>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="flex h-screen bg-green-800">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-20 bg-green-800 flex flex-col items-center">
          <p className={`p-2 text-white hover:bg-green-700 focus:outline-none mt-4 bg-green-700`}>
          {loginName}
          </p>

        <div className=" ps-4 pe-4">
          <button
            onClick={handleLogout}
            className="p-2  mt-56 text-red-700 hover:bg-green-700 focus:outline-none"
          >
            Logout
          </button>
          <button
            onClick={() => handleSectionChange('chat')}
            className={`p-2 text-white hover:bg-green-700 focus:outline-none mt-4 ${
              activeSection === 'chat' ? 'bg-green-700' : ''
            }`}
          >
            chats
          </button>
          <button
            onClick={() => handleSectionChange('contacts')}
            className={`p-2 text-white hover:bg-green-700 focus:outline-none mt-4 ${
              activeSection === 'contacts' ? 'bg-green-700' : ''
            }`}
          >
            Contacts
          </button>
          <button
            onClick={() => handleSectionChange('groups')}
            className={`p-2 text-white hover:bg-green-700 focus:outline-none mt-4 ${
              activeSection === 'groups' ? 'bg-green-700' : ''
            }`}
          >
            Groups
          </button>
        </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex h-full bg-white border-t border-b border-green-200">
            <div className="flex-shrink-0 w-1/4 border-r border-green-200 bg-green-100">
               {activeSection === 'chat' ? <ChatList/>: (activeSection === 'contacts' ? <Contacts /> : <Groups />)}
            </div>

            <div className="flex-1 overflow-y-scroll p-4 bg-gray-100">
              <ChatPage />
            </div>
          </div> 
        </div>

      </div>
    </Fragment>
  );
};

export default Dashboard;