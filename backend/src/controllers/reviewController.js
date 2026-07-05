const { Review, Contract, User } = require('../models');
const logger = require('../utils/logger');

async function createReview(req, res) {
  try {
    const { contractId } = req.params;
    const { rating, comment } = req.body;

    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed contracts' });
    }

    if (req.user.id !== contract.employer_id && req.user.id !== contract.freelancer_id) {
      return res.status(403).json({ error: 'You are not a party to this contract' });
    }

    const existing = await Review.findOne({
      where: { contract_id: contractId, reviewer_id: req.user.id },
    });

    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this contract' });
    }

    const revieweeId = req.user.id === contract.employer_id ? contract.freelancer_id : contract.employer_id;

    const review = await Review.create({
      contract_id: contractId,
      reviewer_id: req.user.id,
      reviewee_id: revieweeId,
      rating,
      comment,
    });

    return res.status(201).json(review);
  } catch (err) {
    logger.error('Error creating review:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserReviews(req, res) {
  try {
    const { userId } = req.params;

    const reviews = await Review.findAll({
      where: { reviewee_id: userId },
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : null;

    return res.json({ reviews, averageRating: averageRating ? parseFloat(averageRating) : null });
  } catch (err) {
    logger.error('Error fetching user reviews:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createReview, getUserReviews };
