const logger = require('../../../../utils/logger');

/**
 * @description Return an object with information to poll device.
 * @param {Object} device - Gladys device.
 * @returns {Object} Return all information used to poll device.
 * @example
 * const pollData = bluetoothManager.getPollData(device);
 */
function getPollData(device) {
  const params = {};
  (device.params || []).forEach((param) => {
    params[param.name] = param.value;
  });

  const brand = this.availableBrands.get(params.brand);

  if (brand) {
    const model = brand.device.models.find((m) => m.name === params.model);

    if (model) {
      return model.pollFeature;
    }
    logger.warn(`Bluetooth : poll data do not find model ${params.model} for device ${device.name}`);
  } else {
    logger.warn(`Bluetooth : poll data do not find brand ${params.brand} for device ${device.name}`);
  }

  return undefined;
}

module.exports = {
  getPollData,
};
