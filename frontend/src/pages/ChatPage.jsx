import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { IoMdSend } from 'react-icons/io';
import { FaPaperclip } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { exchangeId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const currentUserId = user?.id || user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    if (socket) {
      socket.emit('join-chat', exchangeId);
      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });
      return () => {
        socket.off('new-message');
      };
    }
  }, [socket, exchangeId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/messages/${exchangeId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messageData = {
      exchangeId,
      text: newMessage
    };
    
    socket?.emit('send-message', messageData);
    setNewMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exchangeId', exchangeId);
    try {
      const res = await axios.post('http://localhost:5000/api/chat/upload-file', formData);
      const messageData = {
        exchangeId,
        fileUrl: res.data.fileUrl
      };
      socket?.emit('send-message', messageData);
      toast.success('File shared');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${msg.sender._id === currentUserId ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                <p className="text-xs font-medium mb-1">{msg.sender.name}</p>
                {msg.text && <p>{msg.text}</p>}
                {msg.fileUrl && (
                  <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline text-sm">
                    Download File
                  </a>
                )}
                <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={sendMessage} className="border-t border-gray-200 p-4 flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button type="button" onClick={() => fileInputRef.current.click()} className="p-2 rounded-full hover:bg-gray-100">
            <FaPaperclip className="text-gray-500" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary p-2 rounded-full">
            <IoMdSend className="h-5 w-5" />
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ChatPage;
