const { Job, User, Category, Application, Contract } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

async function getJobs(req, res) {
  try {
    const { category, search, min_budget, max_budget, sort, page = 1, limit = 20 } = req.query;

    const where = { status: 'open' };

    if (category) {
      where.category_id = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (min_budget || max_budget) {
      where.budget_max = {};
      if (min_budget) where.budget_max[Op.gte] = min_budget;
      if (max_budget) where.budget_max[Op.lte] = max_budget;
    }

    let order;
    switch (sort) {
      case 'oldest':
        order = [['created_at', 'ASC']];
        break;
      case 'budget_asc':
        order = [['budget_min', 'ASC']];
        break;
      case 'budget_desc':
        order = [['budget_max', 'DESC']];
        break;
      case 'newest':
      default:
        order = [['created_at', 'DESC']];
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [
        { model: User, as: 'employer', attributes: ['id', 'name', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      ],
      order,
      offset,
      limit: Number(limit),
    });

    return res.json({
      jobs: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (err) {
    logger.error('getJobs error', err);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
}

async function getJob(req, res) {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: User, as: 'employer', attributes: ['id', 'name', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Application, as: 'applications', where: { status: 'accepted' }, required: false, include: [{ model: Contract, as: 'contract' }] },
      ],
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.json(job);
  } catch (err) {
    logger.error('getJob error', err);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
}

async function createJob(req, res) {
  try {
    const { title, description, category_id, budget_min, budget_max, deadline } = req.body;

    const job = await Job.create({
      title,
      description,
      category_id,
      budget_min,
      budget_max,
      deadline,
      employer_id: req.user.id,
    });

    return res.status(201).json(job);
  } catch (err) {
    logger.error('createJob error', err);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}

async function updateJob(req, res) {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.id !== job.employer_id) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const allowedFields = ['title', 'description', 'category_id', 'budget_min', 'budget_max', 'deadline'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    await job.update(updates);

    return res.json(job);
  } catch (err) {
    logger.error('updateJob error', err);
    return res.status(500).json({ error: 'Failed to update job' });
  }
}

async function deleteJob(req, res) {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.id !== job.employer_id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await job.destroy();

    return res.status(204).end();
  } catch (err) {
    logger.error('deleteJob error', err);
    return res.status(500).json({ error: 'Failed to delete job' });
  }
}

async function getMyJobs(req, res) {
  try {
    const { status } = req.query;
    const where = { employer_id: req.user.id };

    if (status) {
      where.status = status;
    }

    const jobs = await Job.findAll({
      where,
      include: [
        { model: User, as: 'employer', attributes: ['id', 'name', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(jobs);
  } catch (err) {
    logger.error('getMyJobs error', err);
    return res.status(500).json({ error: 'Failed to fetch your jobs' });
  }
}

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs };
