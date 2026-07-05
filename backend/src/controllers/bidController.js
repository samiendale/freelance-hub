const { Bid, Job, Contract, User } = require('../models');
const logger = require('../utils/logger');

async function getJobBids(req, res) {
  try {
    const { jobId } = req.params;
    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.id !== job.employer_id) {
      return res.status(403).json({ error: 'You do not own this job' });
    }

    const bids = await Bid.findAll({
      where: { job_id: jobId },
      include: [
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'name', 'avatar', 'skills', 'bio'],
        },
      ],
    });

    return res.json(bids);
  } catch (err) {
    logger.error('Error fetching job bids:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function createBid(req, res) {
  try {
    const { jobId } = req.params;
    const { amount, description, timeline } = req.body;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not open for bids' });
    }

    const existing = await Bid.findOne({
      where: { job_id: jobId, freelancer_id: req.user.id },
    });

    if (existing) {
      return res.status(409).json({ error: 'You have already bid on this job' });
    }

    const bid = await Bid.create({
      job_id: jobId,
      freelancer_id: req.user.id,
      amount,
      description,
      timeline,
    });

    return res.status(201).json(bid);
  } catch (err) {
    logger.error('Error creating bid:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateBid(req, res) {
  try {
    const { id } = req.params;
    const { amount, description, timeline } = req.body;

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (req.user.id !== bid.freelancer_id) {
      return res.status(403).json({ error: 'You do not own this bid' });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bids can be updated' });
    }

    await bid.update({ amount, description, timeline });

    return res.json(bid);
  } catch (err) {
    logger.error('Error updating bid:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteBid(req, res) {
  try {
    const { id } = req.params;

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (req.user.id !== bid.freelancer_id) {
      return res.status(403).json({ error: 'You do not own this bid' });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bids can be deleted' });
    }

    await bid.destroy();

    return res.status(204).send();
  } catch (err) {
    logger.error('Error deleting bid:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function acceptBid(req, res) {
  try {
    const { id } = req.params;

    const bid = await Bid.findByPk(id, {
      include: [{ model: Job, as: 'job' }],
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (req.user.id !== bid.job.employer_id) {
      return res.status(403).json({ error: 'You do not own this job' });
    }

    if (bid.job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not open for acceptance' });
    }

    await bid.update({ status: 'accepted' });

    await Bid.update(
      { status: 'rejected' },
      {
        where: {
          job_id: bid.job_id,
          id: { [require('sequelize').Op.ne]: bid.id },
          status: 'pending',
        },
      }
    );

    await bid.job.update({ status: 'in_progress' });

    const contract = await Contract.create({
      job_id: bid.job_id,
      employer_id: bid.job.employer_id,
      freelancer_id: bid.freelancer_id,
      bid_id: bid.id,
      status: 'active',
    });

    return res.status(201).json(contract);
  } catch (err) {
    logger.error('Error accepting bid:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMyBids(req, res) {
  try {
    const bids = await Bid.findAll({
      where: { freelancer_id: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'status'],
        },
      ],
    });

    return res.json(bids);
  } catch (err) {
    logger.error('Error fetching my bids:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getJobBids,
  createBid,
  updateBid,
  deleteBid,
  acceptBid,
  getMyBids,
};
