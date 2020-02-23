const logger = require('../../../../../utils/logger');

/**
 * @description Get the requested service from the peripheral.
 * @param {Object} peripheral - Peripheral to get service from.
 * @param {string} serviceUuid - UUID of the requested service.
 * @returns {Promise<Object>} The requested service, or undefined.
 * @example
 * getService(peripheral, '2a29');
 */
async function getService(peripheral, serviceUuid) {
  try {
    const service = await peripheral.getService(serviceUuid);
    if (service) {
      logger.debug(`Bluetooth: service ${serviceUuid} found for ${peripheral.uuid}`);
    } else {
      logger.warn(`Bluetooth: service ${serviceUuid} not found for ${peripheral.uuid}`);
    }
    return service;
  } catch (e) {
    logger.warn(`Bluetooth: failed to look for service ${serviceUuid} on ${peripheral.uuid}: ${e}`);
    return undefined;
  }
}

module.exports = {
  getService,
};
