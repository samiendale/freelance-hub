const { Application, Job, Contract, User, Notification } = require('../models');
const logger = require('../utils/logger');

async function getJobApplications(req, res) {
  try {
    const { jobId } = req.params;
    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.id !== job.employer_id) {
      return res.status(403).json({ error: 'You do not own this job' });
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      include: [
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'name', 'avatar', 'skills', 'bio'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(applications);
  } catch (err) {
    logger.error('Error fetching job applications:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function apply(req, res) {
  try {
    const { jobId } = req.params;
    const { name, cover_letter } = req.body;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not open for applications' });
    }

    const existing = await Application.findOne({
      where: { job_id: jobId, freelancer_id: req.user.id },
    });

    if (existing) {
      return res.status(409).json({ error: 'You have already applied for this job' });
    }

    const resume_url = req.file ? `/uploads/${req.file.filename}` : null;

    const application = await Application.create({
      job_id: jobId,
      freelancer_id: req.user.id,
      name,
      resume_url,
      cover_letter,
    });

    await Notification.create({
      user_id: job.employer_id,
      type: 'new_application',
      message: `${name} applied for "${job.title}"`,
      link: `/employer/jobs/${jobId}`,
    });

    return res.status(201).json(application);
  } catch (err) {
    logger.error('Error creating application:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMyApplications(req, res) {
  try {
    const applications = await Application.findAll({
      where: { freelancer_id: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'status'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(applications);
  } catch (err) {
    logger.error('Error fetching my applications:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function acceptApplication(req, res) {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id, {
      include: [
        { model: Job, as: 'job' },
        { model: User, as: 'freelancer', attributes: ['name'] },
      ],
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (req.user.id !== application.job.employer_id) {
      return res.status(403).json({ error: 'You do not own this job' });
    }

    if (application.job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not open for acceptance' });
    }

    await application.update({ status: 'accepted' });

    await Application.update(
      { status: 'rejected' },
      {
        where: {
          job_id: application.job_id,
          id: { [require('sequelize').Op.ne]: application.id },
          status: 'pending',
        },
      }
    );

    await application.job.update({ status: 'in_progress' });

    const contract = await Contract.create({
      job_id: application.job_id,
      employer_id: application.job.employer_id,
      freelancer_id: application.freelancer_id,
      application_id: application.id,
      status: 'active',
    });

    await Notification.create({
      user_id: application.freelancer_id,
      type: 'application_accepted',
      message: `Your application for "${application.job.title}" was accepted!`,
      link: `/freelancer/applications`,
    });

    return res.status(201).json(contract);
  } catch (err) {
    logger.error('Error accepting application:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function rejectApplication(req, res) {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;

    const application = await Application.findByPk(id, {
      include: [
        { model: Job, as: 'job' },
        { model: User, as: 'freelancer', attributes: ['name'] },
      ],
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (req.user.id !== application.job.employer_id) {
      return res.status(403).json({ error: 'You do not own this job' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Application is not pending' });
    }

    await application.update({ status: 'rejected', rejection_reason });

    await Notification.create({
      user_id: application.freelancer_id,
      type: 'application_rejected',
      message: rejection_reason
        ? `Your application for "${application.job.title}" was rejected: ${rejection_reason}`
        : `Your application for "${application.job.title}" was rejected`,
      link: '/freelancer/applications',
    });

    return res.json({ message: 'Application rejected', application });
  } catch (err) {
    logger.error('Error rejecting application:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getJobApplications, apply, getMyApplications, acceptApplication, rejectApplication };
