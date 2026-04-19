import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';

const RequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/requests/incoming'),
        axios.get('http://localhost:5000/api/requests/outgoing')
      ]);
      setIncoming(incomingRes.data);
      setOutgoing(outgoingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update');
    }
  };

  const completeExchange = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/complete`);
      toast.success('Exchange marked as completed');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to complete');
    }
  };

  const RequestCard = ({ request, type }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">
            {type === 'incoming' ? request.sender?.name : request.receiver?.name}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Offers: {request.offeredSkill} -> Wants: {request.requestedSkill}
          </p>
          {request.message && (
            <p className="text-sm text-gray-500 mt-2 italic">"{request.message}"</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Status:{' '}
            <span
              className={`font-medium ${
                request.status === 'Accepted'
                  ? 'text-green-600'
                  : request.status === 'Rejected'
                    ? 'text-red-600'
                    : request.status === 'Completed'
                      ? 'text-blue-600'
                      : 'text-yellow-600'
              }`}
            >
              {request.status}
            </span>
          </p>
        </div>
        <div className="flex space-x-2">
          {type === 'incoming' && request.status === 'Pending' && (
            <>
              <button
                onClick={() => updateStatus(request._id, 'Accepted')}
                className="text-green-600 hover:text-green-700"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => updateStatus(request._id, 'Rejected')}
                className="text-red-600 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </>
          )}
          {request.status === 'Accepted' && (
            <button
              onClick={() => completeExchange(request._id)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Loading requests...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Exchange Requests</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
          {incoming.length === 0 ? (
            <p className="text-gray-500">No incoming requests</p>
          ) : (
            <div className="space-y-3">
              {incoming.map((req) => (
                <RequestCard key={req._id} request={req} type="incoming" />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Outgoing Requests</h2>
          {outgoing.length === 0 ? (
            <p className="text-gray-500">No outgoing requests</p>
          ) : (
            <div className="space-y-3">
              {outgoing.map((req) => (
                <RequestCard key={req._id} request={req} type="outgoing" />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RequestsPage;
