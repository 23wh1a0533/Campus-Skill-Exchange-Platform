import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const MyProfile = () => {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await axios.post('http://localhost:5000/api/users/upload-avatar', formData);
      toast.success('Avatar updated');
      fetchUser();
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/api/users/profile', formData);
      toast.success('Profile updated');
      setEditing(false);
      fetchUser();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const addSkill = (type) => {
    const newSkill = { name: '', level: 'Beginner', description: '' };
    setFormData({
      ...formData,
      [type]: [...(formData[type] || []), newSkill]
    });
  };

  const updateSkill = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };

  const removeSkill = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-primary">Edit Profile</button>
            ) : (
              <div className="space-x-3">
                <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleUpdate} className="btn-primary">Save Changes</button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-6 mb-8">
            <img 
              src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : 'https://via.placeholder.com/100'} 
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            {editing && (
              <div>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm" />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {editing ? (
                <input className="input-field" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              {editing ? (
                <input className="input-field" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              ) : (
                <p className="text-gray-900">{user.location || 'Not specified'}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Skills Offered</label>
                {editing && <button onClick={() => addSkill('skillsOffered')} className="text-primary-600 text-sm">+ Add Skill</button>}
              </div>
              <div className="space-y-3">
                {(editing ? formData.skillsOffered : user.skillsOffered)?.map((skill, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    {editing ? (
                      <div className="space-y-2">
                        <input className="input-field text-sm" placeholder="Skill name" value={skill.name} onChange={(e) => updateSkill('skillsOffered', idx, 'name', e.target.value)} />
                        <select className="input-field text-sm" value={skill.level} onChange={(e) => updateSkill('skillsOffered', idx, 'level', e.target.value)}>
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Expert</option>
                        </select>
                        <textarea className="input-field text-sm" placeholder="Description" value={skill.description} onChange={(e) => updateSkill('skillsOffered', idx, 'description', e.target.value)} />
                        <button onClick={() => removeSkill('skillsOffered', idx)} className="text-red-500 text-sm">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-sm text-gray-600">Level: {skill.level}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Skills Wanted</label>
                {editing && <button onClick={() => addSkill('skillsWanted')} className="text-primary-600 text-sm">+ Add Skill</button>}
              </div>
              <div className="space-y-3">
                {(editing ? formData.skillsWanted : user.skillsWanted)?.map((skill, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    {editing ? (
                      <div className="space-y-2">
                        <input className="input-field text-sm" placeholder="Skill name" value={skill.name} onChange={(e) => updateSkill('skillsWanted', idx, 'name', e.target.value)} />
                        <select className="input-field text-sm" value={skill.level} onChange={(e) => updateSkill('skillsWanted', idx, 'level', e.target.value)}>
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Expert</option>
                        </select>
                        <textarea className="input-field text-sm" placeholder="Description" value={skill.description} onChange={(e) => updateSkill('skillsWanted', idx, 'description', e.target.value)} />
                        <button onClick={() => removeSkill('skillsWanted', idx)} className="text-red-500 text-sm">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-sm text-gray-600">Level: {skill.level}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfile;