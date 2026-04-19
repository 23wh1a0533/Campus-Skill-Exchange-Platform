const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { calculateMatchPercentage } = require('../utils/matchAlgorithm');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { query, skillLevel, location, availability } = req.query;
    const currentUser = await User.findById(req.user.id);
    
    let searchQuery = { _id: { $ne: req.user.id }, isOnboardingComplete: true };
    
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { 'skillsOffered.name': { $regex: query, $options: 'i' } },
        { 'skillsWanted.name': { $regex: query, $options: 'i' } }
      ];
    }
    
    if (skillLevel) {
      searchQuery.$and = [
        { $or: [{ 'skillsOffered.level': skillLevel }, { 'skillsWanted.level': skillLevel }] }
      ];
    }
    
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }
    
    if (availability) {
      searchQuery['availability.mode'] = availability;
    }
    
    let users = await User.find(searchQuery).select('-password');
    const usersWithMatch = users.map(user => ({
      ...user.toObject(),
      matchPercentage: calculateMatchPercentage(currentUser, user)
    }));
    
    res.json(usersWithMatch);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;