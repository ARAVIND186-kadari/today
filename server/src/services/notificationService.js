const Notification = require('../models/Notification');
const { emitNotification } = require('../config/socket');

const createNotification = async ({ owner, workflowId, executionId, type, title, message }) => {
  const notification = new Notification({
    owner,
    workflowId: workflowId || null,
    executionId: executionId || null,
    type: type || 'info',
    title,
    message,
  });

  await notification.save();

  // Real-time broadcast to user socket room
  if (owner) {
    emitNotification(owner.toString(), {
      id: notification._id,
      owner: notification.owner,
      workflowId: notification.workflowId,
      executionId: notification.executionId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};

const getUserNotifications = async (userId, limit = 50) => {
  return Notification.find({ owner: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, owner: userId },
    { $set: { isRead: true } },
    { new: true }
  );
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ owner: userId, isRead: false }, { $set: { isRead: true } });
  return { success: true };
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
