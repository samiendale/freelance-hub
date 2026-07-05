const { Notification } = require('../models');
const logger = require('../utils/logger');

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 50,
    });
    return res.json(notifications);
  } catch (err) {
    logger.error('Error fetching notifications:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUnreadCount(req, res) {
  try {
    const count = await Notification.count({
      where: { user_id: req.user.id, read: false },
    });
    return res.json({ count });
  } catch (err) {
    logger.error('Error counting notifications:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await Notification.update(
        { read: true },
        { where: { user_id: req.user.id, read: false } }
      );
      return res.json({ message: 'All notifications marked as read' });
    }

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await notification.update({ read: true });
    return res.json(notification);
  } catch (err) {
    logger.error('Error marking notification as read:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getNotifications, getUnreadCount, markAsRead };
