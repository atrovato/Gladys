const logger = require('../../../../utils/logger');
const { connectAndRead } = require('../utils/connectAndRead');

/**
 * @description Scans, connects, and reads peripheral information.
 * @param {string} peripheralUuid - Peripheral UUID.
 * @param {*} characteristicUuidsByServiceUuidsMap - Map of services and characteritics to explore to read values.
 * @param {*} callback - Called at end of process.
 * @example
 * this.readPeripheral('01aa00bbcd', { '1800': ['2a00'] }, (error, result) => { logger.info(result) });
 */
function readPeripheral(peripheralUuid, characteristicUuidsByServiceUuidsMap = {}, callback) {
  const discovered = (peripheral) => {
    if (peripheral.uuid === peripheralUuid) {
      this.bluetooth.removeListener('discover', discovered);
      if (this.bluetooth.listenerCount('discover') === 1) {
        logger.debug(`Bluetooth : stop scan on last requested peripheral`);
        this.scan(false);
      }
    }
  };

  const read = () => {
    this.bluetooth.removeListener('scanStop', read);

    const p = this.peripherals[peripheralUuid];
    if (p) {
      connectAndRead(p, characteristicUuidsByServiceUuidsMap, callback);
    } else {
      logger.warn(`Bluetooth : peripheral ${peripheralUuid} is missing and can't be read`);
    }
  };

  const peripheral = this.peripherals[peripheralUuid];
  if (peripheral) {
    connectAndRead(peripheral, characteristicUuidsByServiceUuidsMap, callback);
  } else {
    this.bluetooth.on('discover', discovered);
    this.bluetooth.on('scanStop', read);
    this.scan(true);
  }
}

module.exports = {
  readPeripheral,
};
