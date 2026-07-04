const User = require('./User');
const Category = require('./Category');
const Job = require('./Job');
const Application = require('./Application');
const Contract = require('./Contract');
const Review = require('./Review');
const Notification = require('./Notification');

User.hasMany(Job, { foreignKey: 'employer_id', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'employer_id', as: 'employer' });

Category.hasMany(Job, { foreignKey: 'category_id', as: 'jobs' });
Job.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

User.hasMany(Application, { foreignKey: 'freelancer_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'freelancer_id', as: 'freelancer' });

Job.hasOne(Contract, { foreignKey: 'job_id', as: 'contract' });
Contract.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

User.hasMany(Contract, { foreignKey: 'employer_id', as: 'employer_contracts' });
User.hasMany(Contract, { foreignKey: 'freelancer_id', as: 'freelancer_contracts' });
Contract.belongsTo(User, { foreignKey: 'employer_id', as: 'employer' });
Contract.belongsTo(User, { foreignKey: 'freelancer_id', as: 'freelancer' });

Application.hasOne(Contract, { foreignKey: 'application_id', as: 'contract' });
Contract.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

Contract.hasMany(Review, { foreignKey: 'contract_id', as: 'reviews' });
Review.belongsTo(Contract, { foreignKey: 'contract_id', as: 'contract' });

User.hasMany(Review, { foreignKey: 'reviewer_id', as: 'written_reviews' });
User.hasMany(Review, { foreignKey: 'reviewee_id', as: 'received_reviews' });
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewee_id', as: 'reviewee' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = { User, Category, Job, Application, Contract, Review, Notification };
