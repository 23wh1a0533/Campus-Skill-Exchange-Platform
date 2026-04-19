const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true },
  description: String,
  tags: [String]
});

const AvailabilitySchema = new mongoose.Schema({
  weekdays: { type: Boolean, default: false },
  weekends: { type: Boolean, default: false },
  mode: { type: String, enum: ['Online', 'Offline', 'Both'], default: 'Online' }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  age: Number,
  location: String,
  profilePic: { type: String, default: 'default-avatar.png' },
  skillsOffered: [SkillSchema],
  skillsWanted: [SkillSchema],
  availability: AvailabilitySchema,
  isOnboardingComplete: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);