const logger = require('../../../../../utils/logger');

/**
 * @description Get the requested characteristic from the service.
 * @param {Object} service - Service to get characteristic from.
 * @param {string} characteristicUuid - UUID of the requested characteristic.
 * @returns {Promise<Object>} The requested characteristic, or undefined.
 * @example
 * getCharacteristic(service, '2a29');
 */
async function getCharacteristic(service, characteristicUuid) {
  try {
    const characteristic = await service.getCharacteristic(characteristicUuid);
    logger.debug(
      `Bluetooth: characteristic ${characteristicUuid} found for ${service.uuid} (peripheral: ${service.peripheral.uuid})`,
    );
    return characteristic;
  } catch (e) {
    logger.warn(
      `Bluetooth: characteristic ${characteristicUuid} not found for ${service.uuid} (peripheral: ${service.peripheral.uuid}): ${e}`,
    );
    return undefined;
  }
}

module.exports = {
  getCharacteristic,
};
