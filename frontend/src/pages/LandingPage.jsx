import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHandshake, FaUsers, FaGlobe } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">SkillSwap</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-primary-600">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        </nav>
        
        <div className="py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Exchange Skills,
            <span className="text-primary-600"> Not Money</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Join a community where knowledge is currency. Teach what you know, learn what you love.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">Get Started</Link>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="text-center p-6">
            <FaHandshake className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Peer-to-Peer Exchange</h3>
            <p className="text-gray-600">Direct skill trades without any middlemen or payments</p>
          </div>
          <div className="text-center p-6">
            <FaUsers className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">Learn from real people with real expertise</p>
          </div>
          <div className="text-center p-6">
            <FaGlobe className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Access</h3>
            <p className="text-gray-600">Connect with learners and teachers worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;