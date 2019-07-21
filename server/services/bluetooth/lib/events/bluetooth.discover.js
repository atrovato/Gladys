const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');
const { transformPeripheral } = require('../utils/transformPeripheral');

/**
 * @description When the Bluetooth discovers peripheral, add it to managed peripherals.
 * @param {Object} noblePeripheral - Noble peripheral.
 * @example
 * bluetooth.on('discover', this.discover);
 */
function discover(noblePeripheral) {
  logger.debug(`Bluetooth : discover ${noblePeripheral.uuid}`);

  // Store peripheral
  noblePeripheral.lastSeen = new Date();
  this.peripherals[noblePeripheral.uuid] = noblePeripheral;

  this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
    type: WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DISCOVER,
    payload: transformPeripheral(noblePeripheral),
  });

  noblePeripheral.on('disconnect', () => {
    logger.info(`Bluetooth : disconnect peripheral ${noblePeripheral.uuid}`);
    noblePeripheral.removeAllListeners();
  });
}

module.exports = {
  discover,
};
