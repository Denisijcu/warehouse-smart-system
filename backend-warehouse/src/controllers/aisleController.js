const { Aisle, Section } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const aisles = await Aisle.findAll({ 
      include: [{ model: Section }] 
    });
    
    // 🛡️ Mapeo Defensivo $O(N)$: Forzamos camelCase para que Angular lo lea sin fallos
    const sanitizedAisles = aisles.map(aisle => {
      const aisleData = aisle.toJSON();
      return {
        ...aisleData,
        sections: aisleData.Sections || aisleData.section || [] 
      };
    });

    res.json(sanitizedAisles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const aisle = await Aisle.findByPk(req.params.id, { include: Section });
    if (!aisle) return res.status(404).json({ error: 'Pasillo no encontrado' });
    
    // Mapeo defensivo para el endpoint individual
    const aisleData = aisle.toJSON();
    const sanitizedAisle = {
      ...aisleData,
      sections: aisleData.Sections || aisleData.section || []
    };

    res.json(sanitizedAisle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // 🛡️ Hardening: Destruimos el req.body crudo y extraemos solo lo autorizado
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Inserción segura blindada contra Mass Assignment
    const aisle = await Aisle.create({ name, description });
    res.status(201).json(aisle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const aisle = await Aisle.findByPk(req.params.id);
    if (!aisle) return res.status(404).json({ error: 'Pasillo no encontrado' });

    // 🛡️ Hardening: Parcheo dinámico seguro
    const { name, description } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    await aisle.update(updateData);
    res.json(aisle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const aisle = await Aisle.findByPk(req.params.id);
    if (!aisle) return res.status(404).json({ error: 'Pasillo no encontrado' });
    
    await aisle.destroy();
    res.json({ message: 'Pasillo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};