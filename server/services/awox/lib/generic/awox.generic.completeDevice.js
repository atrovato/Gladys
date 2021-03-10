const { FEATURE_TYPES, fillFeature } = require('../utils/awox.features');

/**
 * @description Complete device according to AwoX model.
 * @param {Object} device - The device to complete.
 * @param {Object} modelData - The device model data.
 * @returns {Object} Filled device.
 * @example
 * completeDevice({ model: 'SML_c9'}, { remote, color, white });
 */
function completeDevice(device, modelData) {
  const { color, white } = modelData;

  // Add switch on/off feature
  fillFeature(device, FEATURE_TYPES.SWITCH.BINARY);

  if (white || color) {
    // Add white brightness feature
    fillFeature(device, FEATURE_TYPES.WHITE.BRIGHTNESS);

    // Add white reset button
    fillFeature(device, FEATURE_TYPES.WHITE.RESET);
  }

  if (color) {
    // Add color feature
    fillFeature(device, FEATURE_TYPES.COLOR.LIGHT);
  }

  return device;
}

module.exports = {
  completeDevice,
};
