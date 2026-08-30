const { Server } = require('socket.io');
const config = require('./env');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow all verified origins or Vercel frontends
        callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for a specific execution timeline
    socket.on('join_execution', (executionId) => {
      socket.join(`execution:${executionId}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined execution:${executionId}`);
    });

    socket.on('leave_execution', (executionId) => {
      socket.leave(`execution:${executionId}`);
      console.log(`[Socket.IO] Socket ${socket.id} left execution:${executionId}`);
    });

    // Join room for user specific notifications
    socket.on('join_user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    console.warn('[Socket.IO] getIO called before initSocket.');
  }
  return io;
};

const emitExecutionEvent = (executionId, eventName, payload) => {
  if (io) {
    io.to(`execution:${executionId}`).emit(eventName, payload);
    // Also broadcast globally for dashboard overview
    io.emit('execution_update', { executionId, eventName, ...payload });
  }
};

const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitExecutionEvent,
  emitNotification,
};
