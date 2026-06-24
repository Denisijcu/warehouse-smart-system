const { StockMovement, Product, User } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const movements = await StockMovement.findAll({
      include: [{ model: Product }, { model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByProduct = async (req, res) => {
  try {
    const movements = await StockMovement.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const movements = await StockMovement.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [{ model: Product }, { model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};