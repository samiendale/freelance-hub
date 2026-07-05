const { Category } = require('../models');
const logger = require('../utils/logger');

async function getAll(req, res) {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });

    return res.json(categories);
  } catch (err) {
    logger.error('Error fetching categories:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function create(req, res) {
  try {
    const { name, slug, description } = req.body;

    const category = await Category.create({ name, slug, description });

    return res.status(201).json(category);
  } catch (err) {
    logger.error('Error creating category:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();

    return res.status(204).send();
  } catch (err) {
    logger.error('Error deleting category:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getAll, create, delete: deleteCategory };
