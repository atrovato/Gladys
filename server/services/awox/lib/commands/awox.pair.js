const { getModelData } = require('../utils/awox.devices');

/**
 * @description Pair an AwoX device
 * @param {Object} device - The device to pair.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * pair({ external_id: 'bluetooth:0102030405'});
 */
async function pair(device) {
  const modelData = getModelData(device);
  const compatibleManager = this.managers.find((m) => m.isCompatible(modelData));

  if (compatibleManager && typeof compatibleManager.pair === 'function') {
    return compatibleManager.pair(device);
  }

  throw new Error(`AwoX: device ${device.external_id} with model ${device.model} not managed`);
}

module.exports = {
  pair,
};
