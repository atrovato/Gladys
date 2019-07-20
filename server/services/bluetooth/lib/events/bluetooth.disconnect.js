const logger = require('../../../../utils/logger');

/**
 * @description When the Bluetooth disconnects peripheral, remove it from managed peripherals.
 * @param {Object} noblePeripheral - Noble peripheral.
 * @example
 * bluetooth.on('disconnect', this.disconnect);
 */
function disconnect(noblePeripheral) {
  logger.debug(`Bluetooth : disconnected ${noblePeripheral.uuid}`);

  // Remove peripheral
  delete this.peripherals[noblePeripheral.uuid];
}

module.exports = {
  disconnect,
};
