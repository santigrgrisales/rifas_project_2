const ventaService = require('./ventas.service');
const logger = require('../../utils/logger');

class VentaController {
  async createVenta(req, res) {
    try {
      const ventaData = {
        ...req.body,
        vendida_por: req.user.id
      };
      
      const venta = await ventaService.createVenta(ventaData);
      
      res.status(201).json({
        success: true,
        message: 'Venta created successfully',
        data: venta
      });
    } catch (error) {
      logger.error('Error in createVenta controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating venta',
        error: error.message
      });
    }
  }

  async getAllVentas(req, res) {
    try {
      const ventas = await ventaService.getAllVentas();
      
      res.json({
        success: true,
        message: 'Ventas retrieved successfully',
        data: ventas
      });
    } catch (error) {
      logger.error('Error in getAllVentas controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving ventas',
        error: error.message
      });
    }
  }

  async getVentasByRifa(req, res) {
    try {
      const { rifa_id } = req.params;
      const ventas = await ventaService.getVentasByRifa(rifa_id);
      
      res.json({
        success: true,
        message: 'Ventas retrieved successfully',
        data: ventas
      });
    } catch (error) {
      logger.error('Error in getVentasByRifa controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving ventas',
        error: error.message
      });
    }
  }

  async getMyVentas(req, res) {
    try {
      const ventas = await ventaService.getVentasByVendedor(req.user.id);
      
      res.json({
        success: true,
        message: 'My ventas retrieved successfully',
        data: ventas
      });
    } catch (error) {
      logger.error('Error in getMyVentas controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving ventas',
        error: error.message
      });
    }
  }

  async getVentaById(req, res) {
    try {
      const { id } = req.params;
      const venta = await ventaService.getVentaById(id);
      
      res.json({
        success: true,
        message: 'Venta retrieved successfully',
        data: venta
      });
    } catch (error) {
      logger.error('Error in getVentaById controller:', error);
      
      if (error.message === 'Venta not found') {
        return res.status(404).json({
          success: false,
          message: 'Venta not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving venta',
        error: error.message
      });
    }
  }

  async updateVenta(req, res) {
    try {
      const { id } = req.params;
      const ventaData = req.body;
      
      const venta = await ventaService.updateVenta(id, ventaData, req.user.id);
      
      res.json({
        success: true,
        message: 'Venta updated successfully',
        data: venta
      });
    } catch (error) {
      logger.error('Error in updateVenta controller:', error);
      
      if (error.message === 'Venta not found') {
        return res.status(404).json({
          success: false,
          message: 'Venta not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error updating venta',
        error: error.message
      });
    }
  }

  async completeVenta(req, res) {
    try {
      const { id } = req.params;
      const venta = await ventaService.completeVenta(id, req.user.id);
      
      res.json({
        success: true,
        message: 'Venta completed successfully',
        data: venta
      });
    } catch (error) {
      logger.error('Error in completeVenta controller:', error);
      
      if (error.message === 'Venta not found') {
        return res.status(404).json({
          success: false,
          message: 'Venta not found'
        });
      }
      
      if (error.message === 'Venta cannot be completed') {
        return res.status(400).json({
          success: false,
          message: 'Venta cannot be completed'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error completing venta',
        error: error.message
      });
    }
  }

  async cancelVenta(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      
      const venta = await ventaService.cancelVenta(id, motivo, req.user.id);
      
      res.json({
        success: true,
        message: 'Venta cancelled successfully',
        data: venta
      });
    } catch (error) {
      logger.error('Error in cancelVenta controller:', error);
      
      if (error.message === 'Venta not found') {
        return res.status(404).json({
          success: false,
          message: 'Venta not found'
        });
      }
      
      if (error.message === 'Completed venta cannot be cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Completed venta cannot be cancelled'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error cancelling venta',
        error: error.message
      });
    }
  }

  async deleteVenta(req, res) {
    try {
      const { id } = req.params;
      const venta = await ventaService.deleteVenta(id);
      
      res.json({
        success: true,
        message: 'Venta deleted successfully',
        data: venta
      });
    } catch (error) {
      logger.error('Error in deleteVenta controller:', error);
      
      if (error.message === 'Venta not found') {
        return res.status(404).json({
          success: false,
          message: 'Venta not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting venta',
        error: error.message
      });
    }
  }

  async getVentasStats(req, res) {
    try {
      const { rifa_id } = req.params;
      const stats = await ventaService.getVentasStats(rifa_id);
      
      res.json({
        success: true,
        message: 'Ventas stats retrieved successfully',
        data: stats
      });
    } catch (error) {
      logger.error('Error in getVentasStats controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving ventas stats',
        error: error.message
      });
    }
  }

  async getMyStats(req, res) {
    try {
      const stats = await ventaService.getVentasStatsByVendedor(req.user.id);
      
      res.json({
        success: true,
        message: 'My ventas stats retrieved successfully',
        data: stats
      });
    } catch (error) {
      logger.error('Error in getMyStats controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving ventas stats',
        error: error.message
      });
    }
  }

  async getVentasByDateRange(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const ventas = await ventaService.getVentasByDateRange(fecha_inicio, fecha_fin);
      
      res.json({
        success: true,
        message: 'Ventas retrieved successfully',
        data: ventas
      });
    } catch (error) {
      logger.error('Error in getVentasByDateRange controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving ventas',
        error: error.message
      });
    }
  }

async getVentaDetalleFinanciero(req, res) {
  try {
    const { id } = req.params;
    const data = await ventaService.getVentaDetalleFinanciero(id);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async getVentasPorCliente(req, res) {
  try {
    const { clienteId } = req.params;
    const ventas = await ventaService.getVentasPorCliente(clienteId);

    res.json({
      success: true,
      data: ventas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
  
}

module.exports = new VentaController();
