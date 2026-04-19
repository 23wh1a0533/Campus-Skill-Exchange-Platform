import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    location: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: { weekdays: false, weekends: false, mode: 'Online' }
  });
  const [currentSkill, setCurrentSkill] = useState({
    name: '',
    level: 'Beginner',
    description: ''
  });

  const addSkill = (type) => {
    if (!currentSkill.name) {
      toast.error('Please enter a skill name');
      return;
    }

    setFormData({
      ...formData,
      [type]: [...formData[type], { ...currentSkill }]
    });
    setCurrentSkill({ name: '', level: 'Beginner', description: '' });
  };

  const removeSkill = (type, index) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/users/onboarding', formData);
      await refreshUser();
      toast.success('Onboarding complete! Welcome to SkillSwap');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Basic Info',
      component: () => (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tell us about yourself</h2>
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age (optional)"
            className="input-field"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location (optional)"
            className="input-field"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      )
    },
    {
      title: 'Skills You Have',
      component: () => (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What can you teach?</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Skill name"
              className="flex-1 input-field"
              value={currentSkill.name}
              onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
            />
            <select
              className="input-field w-32"
              value={currentSkill.level}
              onChange={(e) => setCurrentSkill({ ...currentSkill, level: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
            <button onClick={() => addSkill('skillsOffered')} className="btn-primary">
              Add
            </button>
          </div>
          <textarea
            placeholder="Description (optional)"
            className="input-field"
            value={currentSkill.description}
            onChange={(e) => setCurrentSkill({ ...currentSkill, description: e.target.value })}
          />
          <div className="flex flex-wrap gap-2">
            {formData.skillsOffered.map((skill, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill.name} ({skill.level})
                <button
                  onClick={() => removeSkill('skillsOffered', idx)}
                  className="text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Skills You Want',
      component: () => (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What do you want to learn?</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Skill name"
              className="flex-1 input-field"
              value={currentSkill.name}
              onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
            />
            <select
              className="input-field w-32"
              value={currentSkill.level}
              onChange={(e) => setCurrentSkill({ ...currentSkill, level: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
            <button onClick={() => addSkill('skillsWanted')} className="btn-primary">
              Add
            </button>
          </div>
          <textarea
            placeholder="Description (optional)"
            className="input-field"
            value={currentSkill.description}
            onChange={(e) => setCurrentSkill({ ...currentSkill, description: e.target.value })}
          />
          <div className="flex flex-wrap gap-2">
            {formData.skillsWanted.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill.name} ({skill.level})
                <button
                  onClick={() => removeSkill('skillsWanted', idx)}
                  className="text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Availability',
      component: () => (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">When are you available?</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.availability.weekdays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: {
                      ...formData.availability,
                      weekdays: e.target.checked
                    }
                  })
                }
              />
              Weekdays
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.availability.weekends}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: {
                      ...formData.availability,
                      weekends: e.target.checked
                    }
                  })
                }
              />
              Weekends
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Mode</label>
            <select
              className="input-field"
              value={formData.availability.mode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability: {
                    ...formData.availability,
                    mode: e.target.value
                  }
                })
              }
            >
              <option>Online</option>
              <option>Offline</option>
              <option>Both</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((section, idx) => (
                <div
                  key={idx}
                  className={`flex-1 text-center ${
                    step > idx + 1
                      ? 'text-primary-600'
                      : step === idx + 1
                        ? 'text-primary-600 font-semibold'
                        : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                      step > idx + 1
                        ? 'bg-primary-600 text-white'
                        : step === idx + 1
                          ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-xs mt-1">{section.title}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {steps[step - 1].component()}
          </motion.div>

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-secondary">
                Back
              </button>
            )}
            {step < steps.length ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary ml-auto">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary ml-auto">
                {loading ? 'Submitting...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
