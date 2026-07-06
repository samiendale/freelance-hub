const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  freelancer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  resume_url: {
    type: DataTypes.STRING(255),
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    validate: { isIn: [['pending', 'accepted', 'rejected']] },
  },
  rejection_reason: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Application;
