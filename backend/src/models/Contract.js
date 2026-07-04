const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  employer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  freelancer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'terminated'),
    defaultValue: 'active',
  },
}, {
  tableName: 'contracts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Contract;
