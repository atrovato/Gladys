const BluetoothError = require('../BluetoothError');

/**
 * @description Generates a timeout error.
 * @param {Function} callbackError - Rejction function.
 * @param {string} message - The timeout provider message.
 * @example
 * setTimeout(timeout, 5000, Promise.reject, 'Some error details');
 */
function timeout(callbackError, message) {
  callbackError(new BluetoothError('timeout', message));
}

module.exports = {
  timeout,
};
