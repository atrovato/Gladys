const logger = require('../../../../utils/logger');

/**
 * @description Stop Bluetooth device, remove all listeners.
 * @example
 * bluetooth.stop();
 */
async function stop() {
  logger.info('Bluetooth: powering off...');

  await this.bluetooth.powerOff();
  this.bluetooth = null;
  this.scanning = false;
  this.powered = false;
}

module.exports = {
  stop,
};
