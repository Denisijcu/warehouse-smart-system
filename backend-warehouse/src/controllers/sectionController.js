const { Section, Product } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const sections = await Section.findAll({ include: Product });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByAisle = async (req, res) => {
  try {
    const sections = await Section.findAll({
      where: { aisleId: req.params.aisleId },
      include: Product
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id, { include: Product });
    if (!section) return res.status(404).json({ error: 'Sección no encontrada' });
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id);
    if (!section) return res.status(404).json({ error: 'Sección no encontrada' });
    await section.update(req.body);
    res.json(section);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id);
    if (!section) return res.status(404).json({ error: 'Sección no encontrada' });
    await section.destroy();
    res.json({ message: 'Sección eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};