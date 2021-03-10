const { getModelData } = require('../utils/awox.devices');

/**
 * @description Complete device according to AwoX model.
 * @param {Object} device - The device to complete.
 * @returns {Object} Filled device.
 * @example
 * completeDevice({ model: 'SML_c9'});
 */
function completeDevice(device) {
  const modelData = getModelData(device);

  if (!modelData.awox) {
    return null;
  }

  const compatibleManager = this.managers.find((m) => m.isCompatible(modelData));

  if (compatibleManager) {
    return compatibleManager.completeDevice({ ...device }, modelData);
  }

  return device;
}

module.exports = {
  completeDevice,
};
