const { connectAndRead } = require('../utils/connectAndRead');
const BluetoothError = require('../BluetoothError');

/**
 * @description Scans, connects, and reads peripheral information.
 * @param {string} peripheralUuid - Peripheral UUID.
 * @param {*} characteristicUuidsByServiceUuidsMap - Map of services and characteritics to explore to read values.
 * @param {*} callback - Called at end of process.
 * @example
 * this.readPeripheral('01aa00bbcd', { '1800': ['2a00'] }, (error, result) => { logger.info(result) });
 */
function readPeripheral(peripheralUuid, characteristicUuidsByServiceUuidsMap = {}, callback) {
  if (callback && peripheralUuid) {
    let done = false;

    const read = (peripheral) => {
      if (peripheral.uuid === peripheralUuid) {
        done = true;
        this.scan(false);
        connectAndRead(peripheral, characteristicUuidsByServiceUuidsMap, callback);
      }
    };

    const removeListener = () => {
      this.bluetooth.removeListener('discover', read);
      this.bluetooth.removeListener('scanStop', removeListener);

      if (!done) {
        callback(new BluetoothError('notFound', `Request ${peripheralUuid} peripheral not fount`));
      }
    };

    this.bluetooth.on('discover', read);
    this.bluetooth.on('scanStop', removeListener);
    this.scan(true);
  }
}

module.exports = {
  readPeripheral,
};
