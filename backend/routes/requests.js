const express = require('express');
const ExchangeRequest = require('../models/ExchangeRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, offeredSkill, requestedSkill, message, proposedSchedule } = req.body;
    const [sender, receiver] = await Promise.all([
      User.findById(req.user.id),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) return res.status(404).json({ msg: 'User not found' });
    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({ msg: 'You cannot create an exchange request with yourself' });
    }

    const senderCanTeachSkill = sender.skillsOffered?.some(
      (skill) => skill.name.toLowerCase() === offeredSkill.toLowerCase()
    );
    const receiverOffersRequestedSkill = receiver.skillsOffered?.some(
      (skill) => skill.name.toLowerCase() === requestedSkill.toLowerCase()
    );

    if (!senderCanTeachSkill || !receiverOffersRequestedSkill) {
      return res.status(400).json({ msg: 'Selected skills do not match the users involved in this exchange' });
    }

    const request = new ExchangeRequest({
      sender: req.user.id,
      receiver: receiverId,
      offeredSkill,
      requestedSkill,
      message,
      proposedSchedule
    });
    await request.save();
    
    const notification = new Notification({
      user: receiverId,
      type: 'request',
      title: 'New Exchange Request',
      message: `You have a new skill exchange request`,
      relatedId: request._id
    });
    await notification.save();
    
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/incoming', auth, async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ receiver: req.user.id })
      .populate('sender', 'name profilePic')
      .sort('-createdAt');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/outgoing', auth, async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ sender: req.user.id })
      .populate('receiver', 'name profilePic')
      .sort('-createdAt');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ExchangeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the request receiver can update the status' });
    }

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status update' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ msg: 'Only pending requests can be updated' });
    }

    request.status = status;
    await request.save();
    
    const notification = new Notification({
      user: request.sender,
      type: 'exchange',
      title: `Request ${status}`,
      message: `Your exchange request has been ${status}`,
      relatedId: request._id
    });
    await notification.save();
    
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/:id/complete', auth, async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    const isParticipant =
      request.sender.toString() === req.user.id || request.receiver.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ msg: 'Only exchange participants can complete an exchange' });
    }

    if (request.status !== 'Accepted' && request.status !== 'Completed') {
      return res.status(400).json({ msg: 'Only accepted exchanges can be completed' });
    }

    const alreadyCompleted = request.completedBy.some((userId) => userId.toString() === req.user.id);

    if (!alreadyCompleted) {
      request.completedBy.push(req.user.id);
    }

    const allParticipantsCompleted =
      request.completedBy.some((userId) => userId.toString() === request.sender.toString()) &&
      request.completedBy.some((userId) => userId.toString() === request.receiver.toString());

    if (allParticipantsCompleted) {
      request.status = 'Completed';
    }
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
