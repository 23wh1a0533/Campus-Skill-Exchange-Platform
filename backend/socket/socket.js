const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const ExchangeRequest = require('../models/ExchangeRequest');

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.user.id;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.join(`user-${socket.data.userId}`);

    socket.on('join-chat', async (exchangeId) => {
      try {
        const exchange = await ExchangeRequest.findById(exchangeId);
        if (!exchange) return socket.emit('chat-error', 'Exchange not found');

        const isParticipant =
          exchange.sender.toString() === socket.data.userId ||
          exchange.receiver.toString() === socket.data.userId;

        if (!isParticipant) {
          return socket.emit('chat-error', 'You are not authorized to join this chat');
        }

        socket.join(exchangeId);
        console.log(`User joined room: ${exchangeId}`);
      } catch (error) {
        console.error(error);
        socket.emit('chat-error', 'Unable to join chat');
      }
    });

    socket.on('send-message', async (data) => {
      try {
        const { exchangeId, text, fileUrl } = data;
        const exchange = await ExchangeRequest.findById(exchangeId);
        if (!exchange) return socket.emit('chat-error', 'Exchange not found');

        const isParticipant =
          exchange.sender.toString() === socket.data.userId ||
          exchange.receiver.toString() === socket.data.userId;

        if (!isParticipant) {
          return socket.emit('chat-error', 'You are not authorized to send messages in this chat');
        }

        const message = new Message({
          exchangeId,
          sender: socket.data.userId,
          text,
          fileUrl
        });
        await message.save();

        const populatedMessage = await message.populate('sender', 'name profilePic');

        io.to(exchangeId).emit('new-message', populatedMessage);

        const receiverId =
          exchange.sender.toString() === socket.data.userId ? exchange.receiver : exchange.sender;

        const notification = new Notification({
          user: receiverId,
          type: 'message',
          title: 'New Message',
          message: 'You have a new message in your exchange',
          relatedId: exchangeId
        });
        await notification.save();

        io.to(`user-${receiverId}`).emit('notification', notification);
      } catch (error) {
        console.error(error);
        socket.emit('chat-error', 'Unable to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
