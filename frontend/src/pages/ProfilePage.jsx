import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!user) return <div className="text-center py-12">User not found</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
              <img 
                src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : 'https://via.placeholder.com/120'} 
                alt={user.name}
                className="h-32 w-32 rounded-full border-4 border-white object-cover"
              />
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400" />
                    <span className="ml-1 text-gray-700">{user.rating?.toFixed(1) || 'New'}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="h-4 w-4" />
                      <span className="ml-1 text-sm">{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Skills Offered</h2>
                <div className="space-y-3">
                  {user.skillsOffered?.map((skill, idx) => (
                    <div key={idx} className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-900">{skill.name}</div>
                      <div className="text-sm text-green-700">Level: {skill.level}</div>
                      {skill.description && <div className="text-sm text-gray-600 mt-1">{skill.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Skills Wanted</h2>
                <div className="space-y-3">
                  {user.skillsWanted?.map((skill, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-medium text-blue-900">{skill.name}</div>
                      <div className="text-sm text-blue-700">Level: {skill.level}</div>
                      {skill.description && <div className="text-sm text-gray-600 mt-1">{skill.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Availability</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  {user.availability?.weekdays && 'Weekdays '}
                  {user.availability?.weekends && 'Weekends '}
                </p>
                <p className="text-gray-600 mt-1">Mode: {user.availability?.mode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;