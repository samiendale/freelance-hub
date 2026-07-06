const { User, Job, Contract, Review } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

async function getStats(req, res) {
  try {
    const usersByRole = await User.findAll({
      attributes: ['role', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['role'],
    });

    const jobsByStatus = await Job.findAll({
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['status'],
    });

    const contractsByStatus = await Contract.findAll({
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['status'],
    });

    return res.json({
      users: usersByRole,
      jobs: jobsByStatus,
      contracts: contractsByStatus,
    });
  } catch (err) {
    logger.error('Error fetching stats:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function manageUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { role: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const users = await Promise.all(
      rows.map(async (user) => {
        const jobCount = await Job.count({ where: { employer_id: user.id } });
        const contractCount = await Contract.count({
          where: {
            [Op.or]: [{ employer_id: user.id }, { freelancer_id: user.id }],
          },
        });

        const userData = user.toJSON();
        userData.jobCount = jobCount;
        userData.contractCount = contractCount;
        return userData;
      })
    );

    return res.json({
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    logger.error('Error managing users:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    return res.status(204).send();
  } catch (err) {
    logger.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function manageJobs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { '$employer.name$': { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return res.json({
      jobs: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    logger.error('Error managing jobs:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateJobStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const allowedTransitions = {
      open: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    if (!allowedTransitions[job.status] || !allowedTransitions[job.status].includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${job.status} to ${status}` });
    }

    await job.update({ status });

    return res.json(job);
  } catch (err) {
    logger.error('Error updating job status:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getStats, manageUsers, deleteUser, manageJobs, updateJobStatus };
