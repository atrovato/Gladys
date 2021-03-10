const { generateCommand } = require('./awox.mesh.commands');

/**
 * @description Control a Mesh AwoX device
 * @param {Object} device - The device to control.
 * @param {Object} deviceFeature - The binary deviceFeature to control.
 * @param {number} value - The new value.
 * @param {boolean} updateDevice - Indicate if device can be updated.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * setValue({ external_id: 'bluetooth:0102030405'}, { external_id: 'bluetooth:0102030405:switch'}, 1);
 */
async function setValue(device, deviceFeature, value, updateDevice = false) {
  // Check and generate command
  const command = generateCommand(deviceFeature, value);
  return this.execCommand(device, command, true);
}

module.exports = {
  setValue,
};
