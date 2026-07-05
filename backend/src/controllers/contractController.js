const { Contract, Job, User, Review } = require('../models');
const logger = require('../utils/logger');

async function getMyContracts(req, res) {
  try {
    const { status } = req.query;
    const where = {};

    if (req.user.role === 'employer') {
      where.employer_id = req.user.id;
    } else if (req.user.role === 'freelancer') {
      where.freelancer_id = req.user.id;
    }

    if (status) {
      where.status = status;
    }

    const contracts = await Contract.findAll({
      where,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title'],
        },
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    return res.json(contracts);
  } catch (err) {
    logger.error('Error fetching my contracts:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getContract(req, res) {
  try {
    const { id } = req.params;

    const contract = await Contract.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title'],
        },
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (req.user.id !== contract.employer_id && req.user.id !== contract.freelancer_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.json(contract);
  } catch (err) {
    logger.error('Error fetching contract:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateContractStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contract = await Contract.findByPk(id);

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (req.user.id !== contract.employer_id) {
      return res.status(403).json({ error: 'Only the employer can update contract status' });
    }

    const allowedTransitions = {
      active: ['completed', 'terminated'],
    };

    if (!allowedTransitions[contract.status] || !allowedTransitions[contract.status].includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${contract.status} to ${status}` });
    }

    const updateData = { status };

    if (status === 'completed') {
      updateData.end_date = new Date();

      const job = await Job.findByPk(contract.job_id);
      if (job) {
        await job.update({ status: 'completed' });
      }
    }

    await contract.update(updateData);

    return res.json(contract);
  } catch (err) {
    logger.error('Error updating contract status:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getMyContracts, getContract, updateContractStatus };
