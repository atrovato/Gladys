const { getService } = require('../service/getService');
const { getCharacteristic } = require('../characteristic/getCharacteristic');

/**
 * @description Get the requested characteristic from the service.
 * @param {Object} peripheral - Peripheral to get service from.
 * @param {string} serviceUuid - UUID of the requested service.
 * @param {string} characteristicUuid - UUID of the requested characteristic.
 * @returns {Promise<Object>} The requested characteristic, or undefined.
 * @example
 * getCharacteristic(service, '2a29');
 */
async function getCharacteristicFromPeripheral(peripheral, serviceUuid, characteristicUuid) {
  const service = await getService(peripheral, serviceUuid);

  if (service) {
    return getCharacteristic(service, characteristicUuid);
  }

  return undefined;
}

module.exports = {
  getCharacteristicFromPeripheral,
};
