const logger = require('../../../../utils/logger');
const BluetoothError = require('../BluetoothError');
const { timeout } = require('./timeout');
const { TIMERS } = require('./constants');

/**
 * @description Try to read Noble peripheral characteristic.
 * @param {Object} peripheral - Noble peripheral.
 * @param {Object} characteristic - Noble characteristic.
 * @param {Function} callback - Callback with 1st param as error, 2nd as service map by uuid.
 * @example
 * read(peripheral, characteristic);
 */
function read(peripheral, characteristic, callback) {
  if (!characteristic.properties.includes('read')) {
    callback(
      new BluetoothError(
        'notReadable',
        `Characteristic ${characteristic.uuid} on ${peripheral.address} is not readable`,
      ),
    );
  } else {
    const connectTimeout = setTimeout(
      timeout,
      TIMERS.READ,
      callback,
      `Read ${characteristic.uuid} characteristic timeout for ${peripheral.address}`,
    );
    logger.debug(`Reading characteristic ${characteristic.uuid} on ${peripheral.address}`);

    characteristic.read((error, data) => {
      clearTimeout(connectTimeout);

      if (error) {
        callback(new BluetoothError('readError', error));
      } else {
        callback(null, data);
      }
    });
  }
}

module.exports = {
  read,
};
