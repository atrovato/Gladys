const { setDeviceParam } = require('../../../../utils/setDeviceParam');
const { PARAMS } = require('./awox.mesh.constants');
const { getDefaultCredentials } = require('./awox.mesh.utils');
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
  const { remote, color, white } = modelData;

  // Mesh device needs credentials
  const credentials = getDefaultCredentials(device, remote);
  setDeviceParam(device, PARAMS.MESH_USER, credentials.user);
  setDeviceParam(device, PARAMS.MESH_PASSWORD, credentials.password);

  if (remote) {
    return device;
  }

  // Add switch on/off feature
  fillFeature(device, FEATURE_TYPES.SWITCH.BINARY);

  if (white || color) {
    // Add white brightness feature
    fillFeature(device, FEATURE_TYPES.WHITE.BRIGHTNESS);
    // Add white temperature feature
    fillFeature(device, FEATURE_TYPES.WHITE.TEMPERATURE);
  }

  if (color) {
    // Add color feature
    fillFeature(device, FEATURE_TYPES.COLOR.LIGHT);

    // Add color brightness feature
    fillFeature(device, FEATURE_TYPES.COLOR.SATURATION);
  }

  return device;
}

module.exports = {
  completeDevice,
};
