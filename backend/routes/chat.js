const express = require('express');
const Message = require('../models/Message');
const ExchangeRequest = require('../models/ExchangeRequest');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { chatUpload } = require('../middleware/upload');
const router = express.Router();

router.get('/messages/:exchangeId', auth, async (req, res) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.exchangeId);
    if (!exchange) return res.status(404).json({ msg: 'Exchange not found' });

    const isParticipant =
      exchange.sender.toString() === req.user.id || exchange.receiver.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ msg: 'You are not authorized to view this chat' });
    }

    const messages = await Message.find({ exchangeId: req.params.exchangeId })
      .populate('sender', 'name profilePic')
      .sort('createdAt');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/upload-file', auth, chatUpload.single('file'), async (req, res) => {
  try {
    const exchange = await ExchangeRequest.findById(req.body.exchangeId);
    if (!exchange) return res.status(404).json({ msg: 'Exchange not found' });

    const isParticipant =
      exchange.sender.toString() === req.user.id || exchange.receiver.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ msg: 'You are not authorized to upload files to this chat' });
    }

    res.json({ fileUrl: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
