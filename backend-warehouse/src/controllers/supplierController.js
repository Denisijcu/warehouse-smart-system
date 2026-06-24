const { Supplier, Product } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ include: Product });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id, { include: Product });
    if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await supplier.destroy();
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};