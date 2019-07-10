const logger = require('../../../../utils/logger');

/**
 * @description When the Bluetooth stops scanning.
 * @example
 * bluetooth.on('startStop', this.scanStop);
 */
function scanStop() {
  logger.debug(`Bluetooth : stop scanning`);
  this.scanning = false;

  this.broadcastStatus();
}

module.exports = {
  scanStop,
};