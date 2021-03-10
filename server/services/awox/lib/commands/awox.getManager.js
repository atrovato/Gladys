const { getModelData } = require('../utils/awox.devices');

/**
 * @description Get manager for AwoX device.
 * @param {Object} device - The device to control.
 * @returns {Object} Related manager.
 * @example
 * getManager({ model: 'SML_c9'});
 */
function getManager(device) {
  const modelData = getModelData(device);
  const compatibleManager = this.managers.find((m) => m.isCompatible(modelData));

  if (!compatibleManager) {
    throw new Error(`AwoX: device ${device.external_id} with model ${device.model} not managed`);
  }

  return compatibleManager;
}

module.exports = {
  getManager,
};
