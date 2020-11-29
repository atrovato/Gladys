const { getModelData } = require('../utils/awox.devices');

/**
 * @description Action on delete an AwoX device
 * @param {Object} device - The deleted device.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * postDelete({ external_id: 'bluetooth:0102030405'});
 */
async function postDelete(device) {
  const modelData = getModelData(device);
  const compatibleManager = this.managers.find((m) => m.isCompatible(modelData));

  if (compatibleManager && typeof compatibleManager.postDelete === 'function') {
    return compatibleManager.postDelete(device);
  }

  return null;
}

module.exports = {
  postDelete,
};
