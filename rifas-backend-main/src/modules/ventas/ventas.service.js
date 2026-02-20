const { query } = require('../../db/pool');
const { beginTransaction } = require('../../db/tx');
const SQL_QUERIES = require('./ventas.sql');
const logger = require('../../utils/logger');

class VentaService {
  async createVenta(ventaData) {
    const tx = await beginTransaction();

    try {
      const {
  rifa_id,
  cliente,
  boletas,
  medio_pago_id,
  total_venta,
  total_pagado,
  notas,
  vendida_por
} = ventaData;


      // 🔹 1️⃣ Obtener precio_boleta desde rifas
      const rifaResult = await tx.query(
        `SELECT precio_boleta FROM rifas WHERE id = $1`,
        [rifa_id]
      );

      if (rifaResult.rows.length === 0) {
        throw new Error('Rifa no encontrada');
      }

      const precioBoleta = Number(rifaResult.rows[0].precio_boleta);

      // 🔹 2️⃣ Buscar o crear cliente
      let clienteId;

      let clienteResult = await tx.query(
        'SELECT id FROM clientes WHERE telefono = $1 LIMIT 1',
        [cliente.telefono]
      );

      if (clienteResult.rows.length === 0 && cliente.identificacion) {
        clienteResult = await tx.query(
          'SELECT id FROM clientes WHERE identificacion = $1 LIMIT 1',
          [cliente.identificacion]
        );
      }

      if (clienteResult.rows.length > 0) {
        clienteId = clienteResult.rows[0].id;
      } else {
        const newCliente = await tx.query(
          `INSERT INTO clientes 
           (nombre, telefono, email, direccion, identificacion) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [
            cliente.nombre,
            cliente.telefono,
            cliente.email || null,
            cliente.direccion || null,
            cliente.identificacion || null
          ]
        );
        clienteId = newCliente.rows[0].id;
      }

      // 🔹 3️⃣ Calcular estados
      const saldo_pendiente = total_venta - total_pagado;
      const esPagoCompleto = total_pagado >= total_venta;
      const esAbono = total_pagado > 0 && total_pagado < total_venta;

      // 🔹 4️⃣ Crear venta
      const ventaResult = await tx.query(
        `INSERT INTO ventas (
          rifa_id,
          cliente_id,
          monto_total,
          created_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *`,
        [rifa_id, clienteId, total_venta]
      );

      const venta = ventaResult.rows[0];

      const medioPagoCheck = await tx.query(
  `SELECT id FROM medios_pago WHERE id = $1`,
  [medio_pago_id]
);

if (medioPagoCheck.rows.length === 0) {
  throw new Error('Medio de pago no válido');
}


      const medioPagoId = medio_pago_id || null;


      // 🔹 Calcular monto por boleta
      let montoPorBoleta = 0;
      if (total_pagado > 0) {
        montoPorBoleta = total_pagado / boletas.length;
      }

      // 🔹 5️⃣ Procesar cada boleta
      for (const boletaInfo of boletas) {
        const { id, reserva_token } = boletaInfo;

        const boletaCheck = await tx.query(
          `SELECT id 
           FROM boletas 
           WHERE id = $1 
           AND reserva_token = $2 
           AND bloqueo_hasta > CURRENT_TIMESTAMP`,
          [id, reserva_token]
        );

        if (boletaCheck.rows.length === 0) {
          throw new Error(`Boleta ${id} no está bloqueada o token inválido`);
        }

        let nuevoEstado = 'PAGADA';
        if (esAbono) {
          nuevoEstado = 'ABONADA';
        }

        await tx.query(
  `UPDATE boletas
   SET estado = $1,
       cliente_id = $2,
       vendido_por = $3,
       venta_id = $4,
       reserva_token = NULL,
       bloqueo_hasta = NULL,
       updated_at = CURRENT_TIMESTAMP
   WHERE id = $5`,
  [nuevoEstado, clienteId, vendida_por, venta.id, id]
);


        if (total_pagado > 0) {
          await tx.query(
            `INSERT INTO abonos (
              venta_id,
              registrado_por,
              boleta_id,
              medio_pago_id,
              monto,
              moneda,
              estado,
              notas,
              created_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)`,
            [
              venta.id,
              vendida_por,
              id,
              medioPagoId,
              montoPorBoleta,
              'COP',
              'CONFIRMADO',
              esAbono ? 'Abono inicial' : 'Pago completo'
            ]
          );
        }

        // 🔥 Validar si ya pagó completamente
        const totalAbonadoResult = await tx.query(
          `SELECT COALESCE(SUM(monto),0) as total
           FROM abonos
           WHERE boleta_id = $1`,
          [id]
        );

        const totalAbonado = Number(totalAbonadoResult.rows[0].total);

        if (totalAbonado >= precioBoleta) {
          await tx.query(
            `UPDATE boletas SET estado = 'PAGADA' WHERE id = $1`,
            [id]
          );
        }
      }

      await tx.commit();

      return {
        ...venta,
        total_venta,
        total_pagado,
        saldo_pendiente,
        boletas_vendidas: boletas.length
      };

    } catch (error) {
      await tx.rollback();
      logger.error('Error creating venta:', error);
      throw error;
    }
  }



  async getAllVentas() {
    try {
      const result = await query(SQL_QUERIES.GET_ALL_VENTAS);
      return result.rows;
    } catch (error) {
      logger.error('Error getting ventas:', error);
      throw error;
    }
  }

  async getVentasByRifa(rifa_id) {
    try {
      const result = await query(SQL_QUERIES.GET_VENTAS_BY_RIFA, [rifa_id]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting ventas by rifa:', error);
      throw error;
    }
  }

  async getVentasByVendedor(vendedor_id) {
    try {
      const result = await query(SQL_QUERIES.GET_VENTAS_BY_VENDEDOR, [vendedor_id]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting ventas by vendedor:', error);
      throw error;
    }
  }

  async getVentaById(id) {
    try {
      const result = await query(SQL_QUERIES.GET_VENTA_BY_ID, [id]);
      if (result.rows.length === 0) {
        throw new Error('Venta not found');
      }
      return result.rows[0];
    } catch (error) {
      logger.error(`Error getting venta ${id}:`, error);
      throw error;
    }
  }

  async updateVenta(id, ventaData, actualizada_por) {
    try {
      const {
        cliente_nombre,
        cliente_telefono,
        total_boletas,
        monto_total,
        estado
      } = ventaData;

      const result = await query(SQL_QUERIES.UPDATE_VENTA, [
        cliente_nombre,
        cliente_telefono,
        total_boletas,
        monto_total,
        estado,
        actualizada_por,
        id
      ]);

      if (result.rows.length === 0) {
        throw new Error('Venta not found');
      }

      logger.info(`Venta updated: ${id}`);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error updating venta ${id}:`, error);
      throw error;
    }
  }

  async updateVentaStatus(id, estado, actualizada_por) {
    try {
      const result = await query(SQL_QUERIES.UPDATE_VENTA_STATUS, [
        estado,
        actualizada_por,
        id
      ]);

      if (result.rows.length === 0) {
        throw new Error('Venta not found');
      }

      logger.info(`Venta status updated: ${id} to ${estado}`);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error updating venta status ${id}:`, error);
      throw error;
    }
  }

  async deleteVenta(id) {
    try {
      const result = await query(SQL_QUERIES.DELETE_VENTA, [id]);
      if (result.rows.length === 0) {
        throw new Error('Venta not found');
      }
      logger.info(`Venta deleted: ${id}`);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error deleting venta ${id}:`, error);
      throw error;
    }
  }

  async getVentasStats(rifa_id) {
    try {
      const result = await query(SQL_QUERIES.GET_VENTAS_STATS, [rifa_id]);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error getting ventas stats for rifa ${rifa_id}:`, error);
      throw error;
    }
  }

  async getVentasStatsByVendedor(vendedor_id) {
    try {
      const result = await query(SQL_QUERIES.GET_VENTAS_STATS_BY_VENDEDOR, [vendedor_id]);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error getting ventas stats for vendedor ${vendedor_id}:`, error);
      throw error;
    }
  }

  async getVentasByDateRange(fecha_inicio, fecha_fin) {
    try {
      const result = await query(SQL_QUERIES.GET_VENTAS_BY_DATE_RANGE, [fecha_inicio, fecha_fin]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting ventas by date range:', error);
      throw error;
    }
  }

  async completeVenta(id, actualizada_por) {
    const tx = await beginTransaction();
    
    try {
      const ventaResult = await tx.query(
        'SELECT * FROM ventas WHERE id = $1 FOR UPDATE',
        [id]
      );

      if (ventaResult.rows.length === 0) {
        await tx.rollback();
        throw new Error('Venta not found');
      }

      const venta = ventaResult.rows[0];
      if (venta.estado !== 'pendiente') {
        await tx.rollback();
        throw new Error('Venta cannot be completed');
      }

      const updateResult = await tx.query(
        `UPDATE ventas 
         SET estado = 'completada', actualizada_por = $1, fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [actualizada_por, id]
      );

      await tx.commit();
      logger.info(`Venta completed: ${id}`);
      return updateResult.rows[0];
    } catch (error) {
      await tx.rollback();
      logger.error(`Error completing venta ${id}:`, error);
      throw error;
    }
  }

  async cancelVenta(id, motivo, actualizada_por) {
    const tx = await beginTransaction();
    
    try {
      const ventaResult = await tx.query(
        'SELECT * FROM ventas WHERE id = $1 FOR UPDATE',
        [id]
      );

      if (ventaResult.rows.length === 0) {
        await tx.rollback();
        throw new Error('Venta not found');
      }

      const venta = ventaResult.rows[0];
      if (venta.estado === 'completada') {
        await tx.rollback();
        throw new Error('Completed venta cannot be cancelled');
      }

      const updateResult = await tx.query(
        `UPDATE ventas 
         SET estado = 'cancelada', motivo_cancelacion = $1, actualizada_por = $2, fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [motivo, actualizada_por, id]
      );

      await tx.commit();
      logger.info(`Venta cancelled: ${id}`);
      return updateResult.rows[0];
    } catch (error) {
      await tx.rollback();
      logger.error(`Error cancelling venta ${id}:`, error);
      throw error;
    }
  }


  async registrarAbonoVenta(ventaId, monto, medioPagoId, moneda, userId) {
  const t = await sequelize.transaction();

  try {

    const venta = await Venta.findByPk(ventaId, {
      include: [{ model: Boleta, as: 'boletas' }],
      transaction: t
    });

    if (!venta) throw new Error('Venta no encontrada');

    if (venta.saldo_pendiente <= 0)
      throw new Error('La venta ya está pagada');

    if (monto > venta.saldo_pendiente)
      throw new Error('El monto excede el saldo pendiente');

    const cantidadBoletas = venta.boletas.length;
    const montoPorBoleta = monto / cantidadBoletas;

    for (const boleta of venta.boletas) {
      await Abono.create({
        venta_id: venta.id,
        boleta_id: boleta.id,
        monto: montoPorBoleta,
        estado: 'CONFIRMADO',
        medio_pago_id: medioPagoId,
        moneda,
        registrado_por: userId
      }, { transaction: t });
    }

    const nuevoAbonoTotal = parseFloat(venta.abono_total) + parseFloat(monto);
    const nuevoSaldo = parseFloat(venta.monto_total) - nuevoAbonoTotal;

    let nuevoEstado = 'ABONADA';
    if (nuevoSaldo <= 0) {
      nuevoEstado = 'PAGADA';
    }

    await venta.update({
      abono_total: nuevoAbonoTotal,
      saldo_pendiente: nuevoSaldo,
      estado_venta: nuevoEstado
    }, { transaction: t });

    const estadoBoleta = nuevoEstado === 'PAGADA' ? 'PAGADA' : 'ABONADA';

    await Boleta.update(
      { estado: estadoBoleta },
      { where: { venta_id: venta.id }, transaction: t }
    );

    await t.commit();

    return venta;

  } catch (error) {
    await t.rollback();
    throw error;
  }
}


async getVentaDetalleFinanciero(id) {
  const venta = await query(
    `SELECT v.*, c.nombre, c.telefono
     FROM ventas v
     JOIN clientes c ON v.cliente_id = c.id
     WHERE v.id = $1`,
    [id]
  );

  if (venta.rows.length === 0)
    throw new Error('Venta not found');

  const abonos = await query(
    `SELECT * FROM abonos WHERE venta_id = $1`,
    [id]
  );

  const totalPagado = abonos.rows.reduce(
    (sum, a) => sum + Number(a.monto),
    0
  );

  const montoTotal = Number(venta.rows[0].monto_total);
  const saldoPendiente = montoTotal - totalPagado;

  return {
    ...venta.rows[0],
    total_pagado: totalPagado,
    saldo_pendiente: saldoPendiente > 0 ? saldoPendiente : 0,
    abonos: abonos.rows
  };
}


async getVentasPorCliente(clienteId) {
  const ventas = await query(
    `SELECT id, monto_total, estado_venta, created_at
     FROM ventas
     WHERE cliente_id = $1
     ORDER BY created_at DESC`,
    [clienteId]
  );

  const ventasConSaldo = [];

  for (const venta of ventas.rows) {
    const abonos = await query(
      `SELECT COALESCE(SUM(monto),0) as total_pagado
       FROM abonos
       WHERE venta_id = $1`,
      [venta.id]
    );

    const totalPagado = Number(abonos.rows[0].total_pagado);
    const montoTotal = Number(venta.monto_total);
    const saldoPendiente = montoTotal - totalPagado;

    // Solo mostrar ventas que aún tengan saldo
    if (saldoPendiente > 0) {
      ventasConSaldo.push({
        ...venta,
        total_pagado: totalPagado,
        saldo_pendiente: saldoPendiente
      });
    }
  }

  return ventasConSaldo;
}

}

module.exports = new VentaService();
