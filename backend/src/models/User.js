const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'freelancer',
    validate: { isIn: [['employer', 'freelancer', 'admin']] },
  },
  avatar: {
    type: DataTypes.STRING(255),
  },
  bio: {
    type: DataTypes.TEXT,
  },
  skills: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('skills');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('skills', JSON.stringify(val));
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
