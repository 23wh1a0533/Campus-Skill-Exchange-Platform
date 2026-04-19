import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const MatchCard = ({ user, onRequestExchange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card p-5"
    >
      <div className="flex items-start space-x-4">
        <img 
          src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : 'https://via.placeholder.com/80'} 
          alt={user.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
              <div className="flex items-center mt-1">
                <FaStar className="text-yellow-400 h-4 w-4" />
                <span className="text-sm text-gray-600 ml-1">{user.rating?.toFixed(1) || 'New'}</span>
                {user.location && <span className="text-sm text-gray-400 ml-2">• {user.location}</span>}
              </div>
            </div>
            <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
              {user.matchPercentage}% Match
            </div>
          </div>
          
          <div className="mt-3">
            <div className="mb-2">
              <p className="text-xs text-gray-500 font-medium">Offers:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.skillsOffered?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{skill.name}</span>
                ))}
                {user.skillsOffered?.length > 3 && <span className="text-xs text-gray-500">+{user.skillsOffered.length - 3}</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Wants:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.skillsWanted?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{skill.name}</span>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onRequestExchange(user)}
            className="mt-4 w-full btn-primary text-sm py-2"
          >
            Request Exchange
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;