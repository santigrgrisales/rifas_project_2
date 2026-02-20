const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const logger = require('./utils/logger');
const { errorHandler } = require('./middlewares/error');
const { generalLimiter } = require('./middlewares/rateLimiter');


const reportesRoutes = require('./modules/reportes/reportes.routes');
const authRoutes = require('./modules/auth/auth.routes');
const clientesRoutes = require('./modules/clientes/clientes.routes');
const rifasRoutes = require('./modules/rifas/rifas.routes');
const boletasRoutes = require('./modules/boletas/boletas.routes');
const ventasRoutes = require('./modules/ventas/ventas.routes');
const pagosRoutes = require('./modules/pagos/pagos.routes');
const abonosRoutes = require('./modules/abonos/abonos.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Aplicar rate limiting general a todas las rutas API
app.use('/api', generalLimiter);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Rifas Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clientes: '/api/clientes',
      rifas: '/api/rifas',
      boletas: '/api/boletas',
      ventas: '/api/ventas',
      pagos: '/api/pagos',
      abonos: '/api/abonos'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/rifas', rifasRoutes);
app.use('/api/boletas', boletasRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/abonos', abonosRoutes);
app.use('/api/reportes', reportesRoutes);


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.use(errorHandler);

module.exports = app;
