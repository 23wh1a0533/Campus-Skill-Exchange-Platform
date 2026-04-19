const mongoose = require('mongoose');

const ExchangeRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: String, required: true },
  requestedSkill: { type: String, required: true },
  message: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], 
    default: 'Pending' 
  },
  proposedSchedule: String,
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('ExchangeRequest', ExchangeRequestSchema);