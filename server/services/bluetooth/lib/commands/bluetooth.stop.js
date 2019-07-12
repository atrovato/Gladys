const logger = require('../../../../utils/logger');

/**
 * @description Stop Bluetooth device, remove all listeners.
 * @example
 * bluetooth.stop();
 */
function stop() {
  Object.values(this.peripherals).forEach((peripheral) => {
    peripheral.disconnect();
  });

  logger.debug(`Bluetooth : Removing all Bluetooth listeners`);
  this.bluetooth.removeAllListeners();

  logger.debug(`Bluetooth : Stop discovering`);
  this.bluetooth.stopScanning();
}

module.exports = {
  stop,
};
