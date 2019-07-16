const logger = require('../../../../utils/logger');

/**
 * @description Return an object with information about required device.
 * @param {Object} device - Gladys device.
 * @returns {Object} Return all information used about required device.
 * @example
 * const deviceData = bluetoothManager.getDeviceData(device);
 */
function getDeviceData(device = {}) {
  const params = {};
  (device.params || []).forEach((param) => {
    params[param.name] = param.value;
  });

  const brand = this.availableBrands.get(params.brand);

  if (brand) {
    return brand.device.models.find((m) => m.name === params.model);
  }
  logger.warn(`Bluetooth : poll data do not find brand ${params.brand} for device ${device.name}`);

  return undefined;
}

module.exports = {
  getDeviceData,
};
