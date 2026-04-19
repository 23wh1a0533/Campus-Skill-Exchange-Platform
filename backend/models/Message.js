const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  exchangeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeRequest', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  fileUrl: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);