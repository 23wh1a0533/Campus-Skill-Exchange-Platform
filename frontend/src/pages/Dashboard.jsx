import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MatchCard from '../components/MatchCard';
import SearchFilters from '../components/SearchFilters';
import RequestModal from '../components/RequestModal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/dashboard');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/search?${params}`);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExchange = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Skill Match</h1>
        <p className="text-gray-600 mt-1">Connect with people who want to exchange knowledge</p>
      </div>
      
      <SearchFilters onSearch={handleSearch} />
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <MatchCard key={user._id} user={user} onRequestExchange={handleRequestExchange} />
          ))}
        </div>
      )}
      
      {selectedUser && (
        <RequestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          user={selectedUser}
          onSuccess={fetchUsers}
        />
      )}
    </Layout>
  );
};

export default Dashboard;