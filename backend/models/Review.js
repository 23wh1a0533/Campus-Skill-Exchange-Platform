const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchangeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeRequest' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);