const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { avatarUpload } = require('../middleware/upload');
const { calculateMatchPercentage } = require('../utils/matchAlgorithm');
const router = express.Router();

router.post('/onboarding', auth, async (req, res) => {
  try {
    const { name, age, location, skillsOffered, skillsWanted, availability } = req.body;
    const user = await User.findById(req.user.id);
    
    user.name = name || user.name;
    user.age = age;
    user.location = location;
    user.skillsOffered = skillsOffered;
    user.skillsWanted = skillsWanted;
    user.availability = availability;
    user.isOnboardingComplete = true;
    
    await user.save();
    res.json({ msg: 'Onboarding completed', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/dashboard', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const users = await User.find({ _id: { $ne: req.user.id }, isOnboardingComplete: true }).select('-password');
    
    const usersWithMatch = users.map(user => ({
      ...user.toObject(),
      matchPercentage: calculateMatchPercentage(currentUser, user)
    }));
    
    usersWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
    res.json(usersWithMatch);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, age, location, skillsOffered, skillsWanted, availability } = req.body;
    const user = await User.findById(req.user.id);
    
    if (name) user.name = name;
    if (age) user.age = age;
    if (location) user.location = location;
    if (skillsOffered) user.skillsOffered = skillsOffered;
    if (skillsWanted) user.skillsWanted = skillsWanted;
    if (availability) user.availability = availability;
    
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/upload-avatar', auth, avatarUpload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profilePic = req.file.filename;
    await user.save();
    res.json({ profilePic: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
