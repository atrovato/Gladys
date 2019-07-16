const logger = require('../../../../utils/logger');
const BluetoothError = require('../BluetoothError');
const { timeout } = require('./timeout');
const { TIMERS } = require('./constants');

/**
 * @description Try to read Noble peripheral characteristic.
 * @param {Object} peripheral - Noble peripheral.
 * @param {Object} characteristic - Noble characteristic.
 * @param {Array<number>|Buffer} value - Value to send to peripheral.
 * @param {Function} callback - Callback with 1st param as error, 2nd as service map by uuid.
 * @example
 * send(peripheral, service, characteristic, [0x01]);
 */
function send(peripheral, characteristic, value, callback) {
  if (!characteristic.properties.includes('write')) {
    callback(
      new BluetoothError(
        'notWritable',
        `Characteristic ${characteristic.uuid} on ${peripheral.address} is not writable`,
      ),
    );
  } else {
    const connectTimeout = setTimeout(
      timeout,
      TIMERS.SEND,
      callback,
      `Write ${characteristic.uuid} characteristic timeout for ${peripheral.address}`,
    );
    logger.debug(`Writing ${value} on characteristic ${characteristic.uuid} on ${peripheral.address}`);

    const commandBuffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
    characteristic.write(commandBuffer, false, (error) => {
      clearTimeout(connectTimeout);

      if (error) {
        callback(new BluetoothError('sendError', error));
      } else {
        callback(null, value);
      }
    });
  }
}

module.exports = {
  send,
};
