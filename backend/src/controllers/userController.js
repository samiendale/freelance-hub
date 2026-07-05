const { User, Review } = require('../models');
const logger = require('../utils/logger');

async function getProfile(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reviews = await Review.findAll({ where: { reviewee_id: id } });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : null;

    const userData = user.toJSON();
    userData.receivedReviews = {
      count: reviews.length,
      averageRating: averageRating ? parseFloat(averageRating) : null,
    };

    return res.json({ user: userData });
  } catch (err) {
    logger.error('Error fetching profile:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const allowedFields = ['name', 'bio', 'skills', 'avatar'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    await user.update(updates);

    const { password_hash, ...userData } = user.toJSON();

    return res.json({ user: userData });
  } catch (err) {
    logger.error('Error updating profile:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function listFreelancers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: { role: 'freelancer' },
      attributes: { exclude: ['password_hash'] },
      limit,
      offset,
    });

    const freelancers = await Promise.all(
      rows.map(async (user) => {
        const reviews = await Review.findAll({ where: { reviewee_id: user.id } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : null;

        const userData = user.toJSON();
        userData.averageRating = averageRating ? parseFloat(averageRating) : null;
        return userData;
      })
    );

    return res.json({
      freelancers,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    logger.error('Error listing freelancers:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getProfile, updateProfile, listFreelancers };
