const logger = require('../../../../utils/logger');
const { fillFeatures } = require('./fillFeatures');
const { transformToDevice } = require('./transformToDevice');
const { fillInformation } = require('./fillInformation');
const { addDeviceParam } = require('../utils/addDeviceParam');

/**
 * @description Explore discovered peripheral to determine its features.
 * @param {Object} peripheral - Bluetooth peripheral.
 * @returns {Promise<Object>} Peripheral according to UUID.
 * @example
 * this.explore({});
 */
async function explore(peripheral) {
  logger.debug(`Bluetooth: exploring ${peripheral.uuid}...`);

  // Transform peripheral
  const device = transformToDevice(peripheral);
  this.handleDiscovered(peripheral, device);

  try {
    if (peripheral.connectable) {
      // Connect
      await peripheral.connect();

      // Reads peripheral information
      await fillInformation(peripheral, device);

      // Reads managed features
      await fillFeatures(peripheral, device);

      // Disconnect
      await peripheral.disconnect();
    } else {
      logger.warn(`Blutetooth: peripheral ${peripheral.uuid} is not connectable`);
    }
  } catch (e) {
    logger.error(`Bluetooth: fail to explore peripheral ${peripheral.uuid}: ${e}`);
  } finally {
    addDeviceParam(device, 'loaded', true);
    this.handleDiscovered(peripheral, device);
  }

  return device;
}

module.exports = {
  explore,
};
