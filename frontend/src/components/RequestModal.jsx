import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RequestModal = ({ isOpen, onClose, user, onSuccess }) => {
  const { user: currentUser } = useAuth();
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkill || !requestedSkill) {
      toast.error('Please select skills');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/requests', {
        receiverId: user._id,
        offeredSkill,
        requestedSkill,
        message
      });
      toast.success('Exchange request sent!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Request Exchange with {user.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">I will teach</label>
                <select 
                  className="input-field"
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  required
                >
                  <option value="">Select a skill</option>
                  {currentUser?.skillsOffered?.map((skill, idx) => (
                    <option key={idx} value={skill.name}>{skill.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">I want to learn</label>
                <select 
                  className="input-field"
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  required
                >
                  <option value="">Select a skill</option>
                  {user.skillsOffered?.map((skill, idx) => (
                    <option key={idx} value={skill.name}>{skill.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
                <textarea
                  className="input-field"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and propose a schedule..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestModal;
