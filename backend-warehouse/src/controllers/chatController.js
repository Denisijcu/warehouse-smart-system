const { Anthropic } = require('@anthropic-ai/sdk');
const { Product, Aisle, Section, Supplier, StockMovement, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// ---------------------------------------------------------------------------
// 1. RECOPILAR CONTEXTO DE LA BASE DE DATOS (WAREHOUSE)
// ---------------------------------------------------------------------------
async function getWarehouseContext() {
  const now = new Date();

  // 🔹 Totales generales
  const totalProducts = await Product.count();
  const totalSuppliers = await Supplier.count();

  // 🔹 Stock total (suma de todas las cantidades)
  const totalStockRaw = await Product.sum('quantity');
  const totalStock = totalStockRaw || 0;

  // 🔹 Productos con stock bajo (alerta)
  const lowStockProducts = await Product.findAll({
    where: {
      quantity: { [Op.lte]: sequelize.col('minStock') }
    },
    limit: 5,
    include: [{ model: Section, include: [{ model: Aisle }] }]
  });

  // 🔹 Últimos movimientos (entradas/salidas)
  const recentMovements = await StockMovement.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [{ model: Product }]
  });

  // 🔹 Proveedores activos
  const suppliersList = await Supplier.findAll({ limit: 5 });

  // 🔹 Construir el contexto en texto plano (para el prompt de Claude)
  let ctx = `=== DATOS EN TIEMPO REAL DEL ALMACÉN (actualizado: ${now.toLocaleString()}) ===\n\n`;
  ctx += `RESUMEN GENERAL:\n`;
  ctx += `- Total de productos: ${totalProducts}\n`;
  ctx += `- Unidades totales en stock: ${totalStock}\n`;
  ctx += `- Proveedores registrados: ${totalSuppliers}\n\n`;

  ctx += `ALERTAS DE STOCK BAJO (${lowStockProducts.length} productos críticos):\n`;
  if (lowStockProducts.length > 0) {
    for (const p of lowStockProducts) {
      const sectionName = p.Section?.name || 'N/A';
      const aisleName = p.Section?.Aisle?.name || 'N/A';
      ctx += `  - ${p.name} (SKU: ${p.sku}) | Stock: ${p.quantity} | Mínimo: ${p.minStock} | Ubicación: ${aisleName} - ${sectionName}\n`;
    }
  } else {
    ctx += `  - No hay productos con stock bajo.\n`;
  }

  ctx += `\nÚLTIMOS MOVIMIENTOS DE STOCK:\n`;
  if (recentMovements.length > 0) {
    for (const m of recentMovements) {
      const productName = m.Product?.name || 'Producto eliminado';
      ctx += `  - ${m.type === 'in' ? '📥 Entrada' : '📤 Salida'} | ${productName} | Cantidad: ${m.quantity} | ${m.createdAt.toLocaleString()}\n`;
    }
  } else {
    ctx += `  - No hay movimientos recientes.\n`;
  }

  ctx += `\nPROVEEDORES ACTIVOS:\n`;
  if (suppliersList.length > 0) {
    for (const s of suppliersList) {
      ctx += `  - ${s.name} | Email: ${s.email || 'N/A'} | Tel: ${s.phone || 'N/A'}\n`;
    }
  } else {
    ctx += `  - No hay proveedores registrados.\n`;
  }

  return ctx;
}

// ---------------------------------------------------------------------------
// 2. SISTEMA DE PROMPT (ADAPTADO A WAREHOUSE)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `
Eres el asistente virtual de **Warehouse AI**, una plataforma de gestión de inventario inteligente.

Tu nombre es **WareAI** y eres un asistente experto en:
- Gestión de inventario (productos, stock, ubicaciones)
- Proveedores y compras
- Movimientos de entrada y salida de productos
- Reportes y análisis de stock
- Búsqueda de productos por nombre, SKU o ubicación

MÓDULOS DEL SISTEMA:
- Dashboard: Resumen general con KPIs (totales, alertas)
- Inventario (/inventory): CRUD completo de productos
- Proveedores (/suppliers): Gestión de aliados comerciales
- Reportes (/reports): Gráficos y análisis de datos

CAPACIDADES:
- Consultar datos en tiempo real del almacén
- Responder preguntas sobre productos específicos
- Informar sobre stock disponible
- Alertar sobre productos con stock bajo
- Orientar al usuario sobre cómo usar el sistema

REGLAS:
- Responde siempre en español
- Sé conciso y directo — los encargados de almacén tienen poco tiempo
- Si te preguntan por un producto específico, busca en los datos del contexto
- Para acciones que requieren modificar datos, indica al usuario dónde hacerlo en el sistema
- Nunca inventes datos — solo usa la información del contexto proporcionado
- Usa emojis con moderación para hacer las respuestas más legibles

Los datos en tiempo real del almacén se incluirán en cada mensaje del sistema.
`;

// ---------------------------------------------------------------------------
// 3. CONTROLADOR DEL ENDPOINT CHAT
// ---------------------------------------------------------------------------
exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const { ANTHROPIC_API_KEY } = process.env;

    if (!ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Anthropic API key not configured' });
    }

    // 1. Obtener contexto en tiempo real de la BD
    const warehouseContext = await getWarehouseContext();

    // 2. Construir el system prompt con el contexto inyectado
    const systemWithContext = `${SYSTEM_PROMPT}\n\n${warehouseContext}`;

    // 3. Construir el historial de mensajes (máximo 10 turnos)
    const messages = [];
    // Solo enviamos los últimos 10 mensajes del historial
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }
    // Agregar el mensaje actual del usuario
    messages.push({ role: 'user', content: message });

    // 4. Llamar a la API de Claude (Anthropic)
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5', // o 'claude-3-haiku-20240307' según tu plan
      max_tokens: 1024,
      system: systemWithContext,
      messages: messages,
    });

    const reply = response.content[0].text;

    // 5. Devolver la respuesta al frontend
    res.json({ reply });

  } catch (error) {
    console.error('Error en el chatbot:', error);
    res.status(500).json({ error: 'Error al procesar la consulta del chatbot' });
  }
};