const logger = require('../../../../utils/logger');
const BluetoothError = require('../BluetoothError');
const { timeout } = require('./timeout');
const { TIMERS } = require('./constants');

/**
 * @description Try to connect to Noble peripheral.
 * @param {Object} peripheral - Noble peripheral.
 * @param {Function} callback - Callback with 1st param as error, 2nd as peripheral.
 * @example
 * connect(peripheral, (error, p) => { console.log(error); });
 */
function connect(peripheral, callback) {
  if (!peripheral) {
    callback(new BluetoothError('notExist', `Peripheral not exists`));
  } else if (peripheral.state === 'connected') {
    callback(null, peripheral);
  } else if (peripheral.connectable) {
    logger.debug(`Connecting to peripheral ${peripheral.address}`);

    const connectTimer = setTimeout(timeout, TIMERS.CONNECT, callback, `Connection timeout for ${peripheral.address}`);
    peripheral.connect((error) => {
      clearTimeout(connectTimer);
      if (error) {
        callback(new BluetoothError('connectFail', error));
      } else {
        peripheral.services = null;
        callback(null, peripheral);
      }
    });
  } else {
    callback(new BluetoothError('notConnectable', `Peripheral ${peripheral.address} not connectable or not public`));
  }
}

module.exports = {
  connect,
};
