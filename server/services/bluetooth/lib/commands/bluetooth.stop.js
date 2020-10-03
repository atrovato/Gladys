const logger = require('../../../../utils/logger');

/**
 * @description Stops Bluetooth service, remove all listeners.
 * @example
 * bluetooth.stop();
 */
async function stop() {
  this.discoveredDevices = {};

  logger.debug(`Bluetooth: Stop discovering`);
  await this.bluetooth.stopScanningAsync();

  logger.debug(`Bluetooth: Removing all Bluetooth listeners`);
  this.bluetooth.removeAllListeners();
}

module.exports = {
  stop,
};
